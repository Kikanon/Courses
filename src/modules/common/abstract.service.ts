import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import Logging from 'library/Logging';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly repository: Repository<any>) {}

  // Retrive all objects from database
  async findAll(relations = []): Promise<T[]> {
    try {
      return this.repository.find({ relations });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a list of elements.',
      );
    }
  }

  // Retrive object with condition
  async findBy(condition: FindOptionsWhere<any>, relations = []): Promise<T> {
    try {
      return this.repository.findOne({
        where: condition,
        relations: relations,
      });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${condition}.`,
      );
    }
  }

  // Retrive objects with condition
  async findAllBy(
    condition: FindOptionsWhere<any>,
    relations = [],
  ): Promise<T[]> {
    try {
      return this.repository.find({
        where: condition,
        relations: relations,
      });
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with condition: ${condition}.`,
      );
    }
  }

  // Retrive object by id
  async findById(id: string, relations = []): Promise<T> {
    try {
      const element = await this.repository.findOne({
        where: { id: id },
        relations,
      });
      if (!element) {
        throw new BadRequestException(`Cannot find element with id: ${id}`);
      }
      return element;
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        `Something went wrong while searching for an element with an id: ${id}.`,
      );
    }
  }

  // Remove an object
  async remove(id: string): Promise<T> {
    const element = await this.findById(id);
    try {
      return this.repository.remove(element);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while deleting a element.',
      );
    }
  }

  // Return paginated object (default page size 10)
  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 10;

    try {
      const [data, total] = await this.repository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations,
      });

      return {
        data: data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      };
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while searching for a paginated list.',
      );
    }
  }
}
