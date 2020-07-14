import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from './demo-redux.js';
//connect 负责连接组件,给到redux里的数据放到组件的属性里
//1.负责接收一个组件,把state里的一些数据放进去,返回一个组件
//2.数据变化的时候，能够通知组件
//function写connect
export function connect(mapStateToProps,mapDispatchToProps){
	return function(WrapComponent){
		return class ConnectComponent extends React.Component{

		}
	}
}

export const connect=(mapStateToProps=state=>state,mapDispatchToProps={})=>(WrapComponent)=>{
	return  class ConnectComponent extends React.Component{
		static contextTypes={
			store : PropTypes.object
		}
		constructor(props,context){
			super(props,context);
			this.state={
				props : {}
			}
		}

		componentDidMount(){
			const {store}=this.context;
			store.subscribe(()=>this.update());
			this.update();
		}

		update(){
			//获取mapStateToProps和mapDispatchToProps,放入this.props里
			const {store}=this.context;
			const stateProps=mapStateToProps(store.getState());
			//方法不能直接给，因为需要dispatch
			//直接执行addGun()毫无意义
			//要addGun=()=>store.dispatch(addGun())才有意义,其实就是用dispatch把actionCreate包了一层
			const dispatchProps=bindActionCreators(mapDispatchToProps,store.dispatch);
			this.setState({
				props:{
					...this.state.props,
					...stateProps,
					...dispatchProps
				}
			})
		}

		render (){
			return <WrapComponent {...this.state.props}></WrapComponent>
		}
	}
}

//Provider,把store放到context里,所有的子元素可以直接取到store
export class Provider extends React.Component{
	static childContextTypes={
		store : PropTypes.object
	};

	getChildContext(){
		return {store:this.store}
	}

	constructor(props,context){
		super(props,context);
		this.store=props.store;
	}

	render(){
		return this.props.children
	}

}