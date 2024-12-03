const express = require('express')
const router = express.Router()
const {body,validationResult} = require('express-validator')

// untuk import database
const connect = require('../config/db')

// view
router.get('/', function (req,res){
    //isi data 
    connect.query('SELECT * FROM posts ORDER BY id desc',function(err, rows){
        if(err){    
            return res.status(500).json({
                status:false,
                message: 'Server is not available'
            })
        }else{
            return res.status(200).json({
                status:true,
                message:'Server is available',
                data:rows 
            })
        }
    })
})


router.post('/store',[
    body('nama').notEmpty(),
    body('isi').notEmpty(),
   
],(req,res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            errors:errors.array()
        })
    }

    //definisi from data
    let formData ={
        nama: req.body.nama,
        isi: req.body.isi,
    }

    //memasukan query
    connect.query('INSERT INTO posts SET?', formData, function(err,rows){
        //untuk menampilkan error
        if(err){
            return res.status(500).json({
                status:false,
                message:'Error, Try again later'
            })
        }else{
            return res.status(201).json({
                status:true,
                message:'Data input Successfully'
            })
        }
    })

})

//detail data
router.get('/:id', function(req,res){
    let id = req.params.id
    
    connect.query(`SELECT * FROM posts WHERE ID=${id}`,
        function(error,rows){
            if(error){
                return res.status(500).json({
                    status:false,
                    message: 'Server Error!!'
                })
            }
            // kalo post id nya belum ada / tidak ada
            if(rows.length <= 0){
                return res.status(404).json({
                    status:false,
                    message: 'Data is missing'
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Display data according to id',
                    data: rows[0]
                })
            }
        }
    )
})

// update / edit data

router.patch('/update/:id',[
    body('nama').notEmpty(),
    body('isi').notEmpty(),
],(req,res)=>{
    const errros = validationResult(req)
    if(!errros.isEmpty()){
        return res.status(422).json({
            errors:errros.array()
        })
    }

    let id = req.params.id

    let  formData={
        nama: req.body.nama,
        isi: req.body.isi,
    }

    //update query
    connect.query(`UPDATE posts set ? WHERE id=${id}`, formData,
        function(err,rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Interval server error'
                })
            }else{
                return res.status(200).json({
                    status: true,
                    message: 'Update data success'
                })
            }
        }
    )
}) 

router.delete('/delete/(:id)',
    function(req,res){
        let id = req.params.id
        connect.query(`DELETE FROM posts WHERE id = ${id}`,
            function(error,rows){
                if(error){
                    return res.status(500).json({
                        status:false,
                        message: 'Server Error!!'
                    })
                }else {
                    return res.status(200).json({
                        status: true,
                        message: 'Data has been deleted',
                    })
                }
            }
        )
    }
)

module.exports = router