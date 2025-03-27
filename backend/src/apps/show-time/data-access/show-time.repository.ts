import prisma from "../../../db";
import { CreateShowTimeDTO } from "../domain/dto/create-show-time.dto";

const createShowTime = async (newShowTimeData: CreateShowTimeDTO) => {
  return prisma.showTime.create({ data: newShowTimeData });
};

const getOverlappingShowTime = async (
  theaterId: string,
  startTime: Date,
  endTime: Date
) => {
  return prisma.showTime.findFirst({
    where: {
      theaterId,
      startTime: { lte: endTime },
      endTime: { gte: startTime },
    },
  });
};

export default {
  createShowTime,
  getOverlappingShowTime,
};
