import { Injectable } from "@nestjs/common";

@Injectable()
export class CartService {
    findAll(){
        return "get all carts ";
    }
}
