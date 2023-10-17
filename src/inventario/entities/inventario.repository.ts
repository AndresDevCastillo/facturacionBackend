import { HttpException, Injectable } from "@nestjs/common";
import { DataSource, In, Not, Repository } from "typeorm";
import { Inventario } from "./inventario.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Producto } from "src/producto/entities/producto.entity";

@Injectable()
export class inventarioCustomRepository extends Repository<Inventario> {
    constructor(private dataSource: DataSource,
    @InjectRepository(Producto) private producoRepository: Repository<Producto>) {
    super(Inventario, dataSource.createEntityManager());
  }

  async productosSinInventarios() {
    try {
        const IdsInventario = await this.find({relations: {producto: true}}).then((inventario:any) => {
            console.log(inventario);
            const idsProducto = inventario.map(inventario => {
                return inventario.producto.id;
            })
            return idsProducto;
        });
        
        return await this.producoRepository.find({where: {
            id: Not(In(IdsInventario)),
            estado: true
        }})
    } catch (error) {
        this.handleBDerrors(error);
    }
  }

    private handleBDerrors(error: any) {
    console.log(error);
    throw new HttpException('Por favor revise los logs del sistema', 500, {
      cause: error,
    });
  }
}