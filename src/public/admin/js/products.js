//Change Status//
const buttonChangeStatus=document.querySelectorAll('[button-change-status]')
if(buttonChangeStatus.length > 0 ){
    const formChangseStatus=document.querySelector("#form-change-status")
    const path =formChangseStatus.getAttribute('data-path')

    buttonChangeStatus.forEach(button =>{
        button.addEventListener('click',()=>{
            const currentStatus = button.getAttribute('data-status')
            const id = button.getAttribute('data-id')

            let changeStatus = currentStatus == "active" ? "inactive" : "active"

            const action = path + `/${changeStatus}/${id}`+'?_method=PATCH'
            formChangseStatus.action=action
            formChangseStatus.submit()
        })
    })
}

//End Change Status//

//Checkbox Multi//
const checkboxMulti=document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
    const inputsID=checkboxMulti.querySelectorAll("input[name='id']")
    
    inputCheckAll.addEventListener('click',() =>{
        if(inputCheckAll.checked){
            inputsID.forEach(input =>{
                input.checked=true
            })
        }else{
            inputsID.forEach(input =>{
                input.checked=false
            })
        }
    })

    inputsID.forEach(input =>{
        input.addEventListener('click',() =>{
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length

            if(inputsID.length == countChecked){
                inputCheckAll.checked=true
            }else{
                inputCheckAll.checked=false
            }

        })
    })
}
//ENd Checkbox Multi//

// Form Change Multi//
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener('submit',(e) =>{
        e.preventDefault()

        const checkboxMulti=document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")

        const typeChange=e.target.elements.type.value
        if(typeChange=="deleted-all"){
            const isConfirm= confirm("Bạn có muốn xóa những sản phẩm này")
            if(!isConfirm){
                return
            }
        }

        if(inputsChecked.length >0){
            let ids=[]
            const inputIds=formChangeMulti.querySelector("input[name='ids']")
            inputsChecked.forEach(input =>{
                const id=input.value

                if(typeChange=='change-position'){
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    ids.push(`${id}-${position}`)  
                }else{
                    ids.push(id)  
                }

            })
            inputIds.value=ids.join(',')
            formChangeMulti.submit()
        }else{
            alert("Vui lòng chọn ít nhất một bản ghi")
        }

    })
}
// End Form Change Multi//

//Delete Item//
const buttonDelete=document.querySelectorAll('[button-delete]')
const fomrDelete=document.querySelector("#form-delete-item")

if(buttonDelete.length >0){
    const path=fomrDelete.getAttribute("data-path")
    buttonDelete.forEach(button => {
        button.addEventListener('click',() =>{
            const isConfirm = confirm("Bạn có muốn xóa không")
            if(isConfirm){
                const id =button.getAttribute("data-id")

                action=`${path}/${id}?_method=DELETE`

                fomrDelete.action=action
                fomrDelete.submit()
            }
        })
    })
}
//End Delete Item//

// Restore Item //
const buttonRestore=document.querySelectorAll('[button-restore]')
const fomreRestore=document.querySelector("#form-restore-id")

if(buttonRestore.length >0){
    const path=fomreRestore.getAttribute("data-path")
    buttonRestore.forEach(button => {
        button.addEventListener('click',() =>{     
                const id =button.getAttribute("data-id")

                action=`${path}/${id}?_method=PATCH`

                fomreRestore.action=action
                fomreRestore.submit()        
        })
    })
}
// End Restore Item //


// Delete Item//

const buttonTrashDelete=document.querySelectorAll('[button-trash-deleted]')
const fomrTrashDelete=document.querySelector("#form-trash-deleted")

if(buttonTrashDelete.length >0){
    const path=fomrTrashDelete.getAttribute("data-path")
    buttonTrashDelete.forEach(button => {
        button.addEventListener('click',() =>{
            const isConfirm = confirm("Bạn có muốn xóa không")
            if(isConfirm){
                const id =button.getAttribute("data-id")

                action=`${path}/${id}?_method=DELETE`

                fomrTrashDelete.action=action
                fomrTrashDelete.submit()

            }
        })
    })
}
//End Delete Item//


// Form Trash Change Multi//
const formTrashChangeMulti = document.querySelector("[form-trash-change-multi]")
if(formTrashChangeMulti){
    formTrashChangeMulti.addEventListener('submit',(e) =>{
        e.preventDefault()

        const checkboxMulti=document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked")

        const typeChange=e.target.elements.type.value
        if(typeChange=="deleted-all"){
            const isConfirm= confirm("Bạn có muốn xóa những sản phẩm này")
            if(!isConfirm){
                return
            }
        }

        if(inputsChecked.length >0){
            let ids=[]
            const inputIds=formTrashChangeMulti.querySelector("input[name='ids']")
            inputsChecked.forEach(input =>{
                const id=input.value
                ids.push(id)
            })
            inputIds.value=ids.join(',')
            formTrashChangeMulti.submit()
        }else{
            alert("Vui lòng chọn ít nhất một bản ghi")
        }

    })
}
// End Trash Form Change Multi//

