import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.inteface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

 
 
  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
  ){}

  async execeuteSeed(){

    await this.pokemonModel.deleteMany({}).exec(); //delete all documents / DELETE * FROM pokemons

    const url='https://pokeapi.co/api/v2/pokemon?limit=650';
    const data=await this.http.get<PokeResponse>(url);

    // //! metodo 1. ineficiente porque hace muchas peticiones a la base de datos
    // const insertPromisesArray=[];
    
    // data.results.forEach(({name, url}) => {
    //   const segments=url.split('/');
    //   const no:number=+segments[segments.length-2];
    //   // await this.pokemonModel.create({no, name});

    //   insertPromisesArray.push(this.pokemonModel.create({no, name}));
    // })

    // await Promise.all(insertPromisesArray);
    // return 'seed executed';

    //! metodo 2. eficiente porque solo hace una peticion a la base de datos

    const pokemonToInsert: {name:string, no:number}[]=[];

    data.results.forEach(({name, url}) => {
        const segments=url.split('/');
        const no:number=+segments[segments.length-2];

        pokemonToInsert.push({name, no});
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

   return 'seed executed';


  }
}
