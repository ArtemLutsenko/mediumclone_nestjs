import { Injectable } from "@nestjs/common";
import { TagEntity } from "@app/tag/tag.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TagService{
  constructor(@InjectRepository(TagEntity)
              private readonly tagRepository: Repository<TagEntity>) {
  }
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find()
  }
}
