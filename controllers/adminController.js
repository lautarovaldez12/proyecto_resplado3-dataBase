const fs = require("fs");
const {getProducts, setProducts} = require("../data/products");
const productos = getProducts();
const path = require("path");

module.exports = {
    index: (req, res) => {

        //en el main de admin enviamos todo el listado de los productos
        res.render("admin/productoLista",{
            productos
        })
    },   
    cargaProducto : (req,res) => {
        res.render("admin/cargaProducto")
    },
    storeProducto: (req, res) => {
        
        
        //capturamos el ultimo ID
        let lastID = 1;
        productos.forEach(producto => {
            if (producto.id > lastID) {
                lastID = producto.id
            }
        });

        let especificaciones;

        //capturamos lo que viene del formulario
        const {image, title, price, insale, garantia, component, mark, category, model, stock, description, features, componente} = req.body;

                /*SE VA A USAR PARA LA CARGA DE PRODUCTOS en caracteristicas*/
                switch (true) {
                    case component == "ram":
                        /* RES PARAMS: agarra las propiedades de un objeto y las pone en variables segun el tittleProduct */
                        const {capacidad,velocidad,latencia,voltaje,tipo} = req.body;
                        /*verificar si la variable especificaciones se puede usar fuera del switch*/ 
                         especificaciones = {
                            capacidad,
                            velocidad,
                            latencia,
                            voltaje,
                            tipo
                        }
                        
                        break;
                    case component == 'grafica':
                        const {busMemory,conectividad,frecuencia,speedMemory,graphicType} = req.body;
        
                        especificaciones = {
                            busMemory,
                            conectividad,
                            frecuencia,
                            speedMemory,
                            graphicType
                        }
        
                        break;
                    case component == 'procesador':
                        const {processGeneration,cores} = req.body;
        
                        especificaciones = {
                            processGeneration,
                            cores
                        }
                        break;
        
                }
        








        //creamos el nuevo producto
        const producto = {
            id: Number(lastID +1),
            title,
            price,
            insale,
            garantia,
            component,
            mark,
            model,
            stock,
            description,
            features,
            category,
            caracteristicas : especificaciones,
            image: req.files[0].filename
        }

    
        //pushear a la base de datos de productos, el nuevo producto
        productos.push(producto);

        setProducts(productos);
        res.redirect("/admin");

    },
    detalleProducto: (req, res) => {
        
        //igualo el dato que nos viene por parametro con el ID que tenemos en nuestra base de datos de productos
        let producto = productos.find(producto => producto.id === +req.params.id);

        res.render("admin/productoDetalle", {
            producto
        });

    },
    editarProducto: (req, res) => {
        
        //igualo el dato que nos viene por parametro con el ID que tenemos en nuestra base de datos de productos
        const producto = productos.find(producto => producto.id === +req.params.id);

        res.render("admin/editarProducto.ejs", {
            producto
        })

    },
    actualizarProducto: (req, res) => {
        
        //capturamos lo que viene del formulario
        const {image, title, price, insale, garantia, component, mark, category, model, stock, description, features} = req.body;

        //actualizamos el nuevo producto

        productos.forEach(producto => {
            if(producto.id === +req.params.id){
                producto.title = title
                producto.price = price
                producto.insale = insale
                producto.garantia = garantia
                producto.component = component
                producto.mark = mark
                producto.model = model
                producto.stock = stock
                producto.description = description
                producto.features = features
                producto.category = category
                producto.image = req.files[0].filename
            }
        });
        
        setProducts(productos);
        res.redirect("/admin");

    },
    borrarProducto: (req, res) => {
        
        productos.forEach(producto => {
            if (producto.id === +req.params.id) {
                
                if (fs.existsSync(path.join("public", "images", producto.image))) {
                    fs.unlinkSync(path.join("public", "images", producto.image))
                }

                let aEliminar = productos.indexOf(producto);
                productos.splice(aEliminar, 1)
            }
        });

        setProducts(productos);
        res.redirect("/admin")
    }
}