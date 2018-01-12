import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
import myFetch from '../../common/myFetch'

import './login.css'

const FormItem = Form.Item

export default class Login extends Component{



    render(){
        return (<div>
            <div className='login'>
               <WrappedNormalLoginForm />
            </div>
        </div>)
    }
}


class NormalLoginForm extends React.Component {
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
                axios.post('api/login',values).then((res)=>{
                    console.log(res)
                    try {
                     myFetch.setAuthor(res.data.token)
                    window.location.hash='/map'
                    }catch (e){
                        console.log('设置token是出现错误',e)
                    }

                }).catch(e=>{
                    myFetch.errHandle(e)
                })
            });
        }
        render() {
        const {getFieldDecorator} = this.props.form;
        return (
        <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
        {getFieldDecorator('userName', {
            rules: [{required: true, message: 'Please input your username!'}],
        })(
            <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="Username"/>
        )}
        </FormItem>
        <FormItem>
        {getFieldDecorator('password', {
            rules: [{required: true, message: 'Please input your Password!'}],
        })(
            <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                   placeholder="Password"/>
        )}
        </FormItem>
        <FormItem>
        {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
        })(
            <Checkbox>Remember me</Checkbox>
        )}
        <a className="login-form-forgot" href="">Forgot password</a>
        </FormItem>
        <FormItem>
        <Button type="primary" style={{width:'100%'}} htmlType="submit" className="login-form-button">
        Log in
        </Button>
        </FormItem>
            <FormItem>
        Or <a href="">register now!</a>

        </FormItem>

        </Form>
        );
    }

    }

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);