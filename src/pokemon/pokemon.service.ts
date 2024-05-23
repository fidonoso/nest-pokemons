import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
  ){
    this.defaultLimit=configService.get<number>('default_limit');
  //  console.log({defaultLimit});
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      
      const pokemon=await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      console.log(error);
      this.handleException(error);
    }
  }

  findAll(paginationDto:PaginationDto) {

    const {limit=this.defaultLimit, offset=0}=paginationDto;
    return this.pokemonModel.find()
      .limit(limit) //limita la respuesta a limit registros
      .skip(offset) //salta los primeros offset registros
      .sort({no:1}) //ordena por el campo 'no' de forma ascendente
      .select('-__v'); //excluye el campo __v de la respuesta
  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    if(!isNaN(+term)){
      pokemon=await this.pokemonModel.findOne({no:term});
    }

    //MongoID
    if(!pokemon && isValidObjectId(term)){
      pokemon=await this.pokemonModel.findById(term);
    }

    //Name
    if(!pokemon){
      pokemon=await this.pokemonModel.findOne({name:term.toLowerCase().trim()});
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon=await this.findOne(term);

    if(updatePokemonDto.name){
      updatePokemonDto.name=updatePokemonDto.name.toLowerCase();

    }
    try {
      await pokemon.updateOne(updatePokemonDto, {new:true});
      return {...pokemon.toJSON(),...updatePokemonDto};
      
    } catch (error) {
      console.log(error);
      this.handleException(error);
    }

  }

  async remove(id: string) {

    // //metodo 1
    // const pokemon= await this.findOne(id);
    // await pokemon.deleteOne();

    //metodo 2 usando el pipe personalizado para asegurar que el id es mongoID valido
    // const result= await this.pokemonModel.findByIdAndDelete(id);

    //metodo 3
    const {deletedCount}= await this.pokemonModel.deleteOne({_id:id});
    if(deletedCount===0) throw new BadRequestException(`Pokemon with id ${id} not found`);

    return ;
  }

  private handleException(error: any) {
    //manejador de errores no controlados
    if(error.code==11000){
      throw new BadRequestException(`Pokemon ${JSON.stringify(error.keyValue)} already exists`);

    }
    
    console.log(error)
    throw new InternalServerErrorException('Can´t create Pokemon - Check server logs');
  }
}
