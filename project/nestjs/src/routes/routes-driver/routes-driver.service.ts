import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoutesDriverService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrUpdate(dto: { route_id: string; lat: number; lng: number }) {
    /* const countRouteDriver = await this.prismaService.routeDriver.count({
      where: {
        route_id: dto.route_id,
      },
    });*/

    return this.prismaService.routeDriver.upsert({
      where: {
        route_id: dto.route_id,
      },
      create: {
        route_id: dto.route_id,
        points: {
          set: {
            lat: dto.lat,
            lng: dto.lng,
          },
        },
      },
      update: {
        points: {
          set: {
            lat: dto.lat,
            lng: dto.lng,
          },
        },
      },
      include: {
        route: true,
      },
    });
  }
}
