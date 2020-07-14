export function createStore(reducer,enhancer){

	if(enhancer){
		return enhancer(createStore)(reducer);
	}

	let currentState={};
	let currentListeners=[];

	function getState(){
		return currentState
	}

	function subscribe(listener){
		currentListeners.push(listener);
	}

	function dispatch(action){
		currentState=reducer(currentState,action);
		currentListeners.forEach(v=>v());
		return action
	}
	dispatch({type:'@IMOOC/WONIU-REDUX'})
	return {getState,subscribe,dispatch}

}

//const store=createStore(reducer,applyMiddleware(thunk))
export function applyMiddleware(...middlewares){
	return createStore=>(...args)=>{
		const store=createStore(...args);
		let dispatch=store.dispatch;
		const midApi={
			getState : store.getState,
			dispatch : (...args)=>dispatch(...args);
		}
		const middlewareChain=middlewares.map(middleware=>middleware(midApi));
		// dispatch=compose(...middlewareChain)(store.dispatch);
		// dispatch=middleware(midApi)(store.dispatch);
		return {
			...store,
			dispatch
		}
	}
}

export function compose(...funcs){
	if(funcs.length==0){
		return arg=>arg
	}
	if(funcs.length==1){
		return funcs[0]
	}
	return funcs.reduce((ret,item)=>(...args)=>ret(item(...args)))
}



export function bindActionCreator(creator,dispatch){
	return (...args)=>dispatch(creator(...args));
}

export function bindActionCreators(creators,dispatch){
	let bound={};
	Object.keys(creators).forEach(v=>{
		let creator=creators[v];
		bound[v]=bindActionCreator(creator,dispatch);
	})
	return bound
}
