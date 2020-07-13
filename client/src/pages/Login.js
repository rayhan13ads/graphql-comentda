import React,{useState, useContext} from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'
import { LOGIN_MUTATION } from '../db/authGql'
import { useForm } from '../utils/hooks'
import { AuthContext } from '../context/auth'




const Login = (props) => {

    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values} = useForm(loginCallback,{
        username:'',
        password:''
    })

    const context = useContext(AuthContext)

    const [login, {loading}] = useMutation(LOGIN_MUTATION  ,{
        update(proxy,result){
            console.log(result);
            context.login(result.data.login)
            props.history.push('/')
        },  
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables:values
    })
    
    function loginCallback() {
        login();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} className={loading ? 'loading':''}>
                <h1>Login</h1>

                <Form.Input 
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    error={errors.username ? true :false}
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input 
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true :false}
                    onChange={onChange}
                />

                <Button type="submit" primary>Login</Button>
            </Form>
           {
               Object.keys(errors).length > 0 && (
                <div className="ui error message">
                <ul className="list">
                    {
                        Object.values(errors).map(err => (
                        <li key={err}>{err}</li>
                        ))
                    }  
                </ul>
            </div>
               )
           }
        </div>
    )
}

export default Login
