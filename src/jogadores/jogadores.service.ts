import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dto/criarJogador.dto';
import { Jogador } from './interface/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { PassThrough } from 'stream';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async CriarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;
    const jogadorEncontrado = this.jogadores.find(x => x.email === email);

    if (jogadorEncontrado) {
      return await this.atualizar(jogadorEncontrado, criarJogadorDto);
    }

    await this.criar(criarJogadorDto);
  }

  async ConsultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async ConsultaJogadorPorEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = this.jogadores.find(x => x.email === email);
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }
    return jogadorEncontrado;
  }

  async DeleteJogador(email: string): Promise<void> {
    const jogadorEcontrado = this.jogadores.find(
      jogador => jogador.email === email,
    );

    if (!jogadorEcontrado) {
      throw new NotFoundException(
        `Não encontramos um jogador com o e-mail informado, email: ${email}`,
      );
    } else {
      this.jogadores = this.jogadores.filter(
        jogador => jogador.email !== email,
      );
    }
  }

  private criar(criarJogadorDto: CriarJogadorDto): void {
    const { email, nome, telefoneCelular } = criarJogadorDto;
    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJOgador: 'https://www.fotos.com/fotodi312.jpg',
    };
    this.logger.log(`criarJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }

  private atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): void {
    const { nome } = criarJogadorDto;
    jogadorEncontrado.nome = nome;
  }
}
