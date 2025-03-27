import prisma from "../../../db";
import { CreateShowTimeDTO } from "../domain/dto/create-show-time.dto";

const createShowTime = async (newShowTimeData: CreateShowTimeDTO) => {
  return prisma.showTime.create({ data: newShowTimeData });
};

export default {
  createShowTime,
};
