import React, { createContext , useReducer} from 'react'
import { LOGIN_TYPE,LOGOUT_TYPE } from "./types";
import jwtDecode from 'jwt-decode'


const initialState = {
    user:null
}

if (localStorage.getItem('jwtToken')) {
    const decode = jwtDecode(localStorage.getItem('jwtToken')) 
    
    if (decode.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken')
    }else{  
        initialState.user = decode
    }
}


const AuthContext = createContext({
    user:null,
    login:(userData)=>{},
    logout: ()=>{
         
    }
})

export function authReducer(state,action){

    switch (action.type) {
        case LOGIN_TYPE:
            return {
                ...state,
                user:action.payload
            }
            break;
        case LOGOUT_TYPE:
            return {
                ...state,
                user:null
            }
            break;
        default:
            return state
            break;
    }

}


function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, initialState)

    function login(userData) {
        localStorage.setItem('jwtToken',userData.token)
        dispatch({
            type:LOGIN_TYPE,
            payload: userData
        })
        
    }


    function logout(params) {
        localStorage.removeItem('jwtToken')
        dispatch({
            type:LOGOUT_TYPE,
        })
    }


    return (
        <AuthContext.Provider value={{user:state.user,login,logout}} {...props} />
    )

}

export {AuthContext, AuthProvider}