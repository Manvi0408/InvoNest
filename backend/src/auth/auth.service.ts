import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: { email: string; pass: string; firstName?: string; lastName?: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.pass, salt);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    // Auto-provision a default organization to speed up trial boarding
    const orgName = data.firstName ? `${data.firstName}'s Workspace` : 'Default Workspace';
    const orgSlug = `${user.email.split('@')[0]}-org-${Math.floor(Math.random() * 1000)}`;

    const org = await this.prisma.organization.create({
      data: {
        name: orgName,
        slug: orgSlug,
      },
    });

    // Map user as admin in organization
    const membership = await this.prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: 'ADMIN',
      },
    });

    const token = this.generateToken(user.id, user.email, org.id, 'ADMIN');

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      organization: org,
      token,
    };
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { memberships: { include: { organization: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Grab first active organization or map empty
    const mainMembership = user.memberships[0];
    const orgId = mainMembership ? mainMembership.organizationId : '';
    const role = mainMembership ? mainMembership.role : 'MEMBER';

    const token = this.generateToken(user.id, user.email, orgId, role);

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      organization: mainMembership?.organization || null,
      token,
    };
  }

  private generateToken(userId: string, email: string, orgId: string, role: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
      orgId,
      role,
    });
  }
}
