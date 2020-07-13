import React,{useState, useContext} from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_REGISTER_MUTATION } from '../db/authGql'
import { useForm } from '../utils/hooks'
import { AuthContext } from '../context/auth'



const Register = (props) => {

    const [errors, setErrors] = useState({})

    const {onChange, onSubmit, values} = useForm(registerUser,{
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const context = useContext(AuthContext)

    const [addUser, {loading}] = useMutation(CREATE_REGISTER_MUTATION,{
        update(proxy,result){
            context.login(result.data.login)
            props.history.push('/login')
        },  
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables:values
    })
    
    function registerUser() {
        addUser();
    }


    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} className={loading ? 'loading':''}>
                <h1>Register</h1>

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
                    label="Email"
                    placeholder="Email..."
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true :false}
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
                <Form.Input 
                    label="Confirm Password"
                    placeholder="Confirm Password..."
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true :false}
                    onChange={onChange}
                />

                <Button type="submit" primary>Register</Button>
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

export default Register
