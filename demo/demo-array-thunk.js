
const arrayThunk=({dispatch,getState})=>next=>action=>{

	if(Array.isArray(action)){
		return action.forEach(v=>dispatch(v));
	}

	

	//默认什么都没干
	return next(action);
}

export default arrayThunk
