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
// End Change Status//


//Delete Item//
const buttonDelete=document.querySelectorAll('[button-delete]')
const fomrDelete=document.querySelector("#form-delete-account")

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