import { Injectable } from "@angular/core";
import { LoginModule } from "../models/loginModel";
import { HttpClient } from "@angular/common/http";
import { ResponseModel } from "../models/responseModel";
import { TokenModel } from "../models/tokenModel";
import { SingleResponseModel } from "../models/singleResponseModel";

@Injectable({
    providedIn: 'root'
})

export class AuthService{
    apiUrl= 'http://localhost:5038/api/auth/';
    constructor(private httpClient:HttpClient) { }

    login(loginModel:LoginModule){
        return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"login",loginModel)
    }

    isAuthenticated(){
        //Tarayıcı yenilendiği anda bilgiler burada tutulur
        if(localStorage.getItem("token")){
            return true;
        }
        else{
            return false;
        }
    }
}