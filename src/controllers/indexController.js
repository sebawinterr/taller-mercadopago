const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
})

module.exports = {
    home: (req, res) => {
        return res.render("index");
    },
    detail: (req, res) => {
        return res.render("detail", { ...req.query });
    },
    callback: (req, res) => {
        console.log(req.query);

        if(req.query.status.includes('success')) {
            return res.render('success');
        }

        if(req.query.status.includes('pending')) {
            return res.render('pending');
        }

        if(req.query.status.includes('failure')) {
            return res.render('failure');
        }

        return res.status(404).end();
    },
    notifications: (req, res) => {
        console.log(req.body);
        res.status(200).end('Ok');
    },
    comprar: (req, res) => {
        const url = 'https://mercadopago-dh.herokuapp.com/callback?status='; //Hay que cambiar esta URL para la            certificacion con Heroku
        const host = 'https://mercadopago-dh.herokuapp.com';


        let preference = {
            back_urls: {
                success: url + 'success',
                pending: url + 'pending',
                failure: url + 'failure'
            },
            auto_return: 'approved',
            notification_url: host + 'notifications',
            payer: {
                name: 'Ryan',
                surname: 'Dahl',
                email: 'test_user_63274575@testuser.com',
                phone:{
                    area_code: '11',
                    number: 55556666
                },
                address: {
                    zip_code: '1234',
                    street_name: 'Monroe',
                    street_number: 860
                }
            },
            payment_methods: {
                excluded_payment_methods: [     // tarjetas excluidas
                    {id: 'visa'}
                ],
                excluded_payment_types: [   // medios de pago excluidos
                    {id: 'atm'}
                ],
                installments: 12 // Cantidad maxima de cuotas
                
            },
            items: [
                {
                    id: '1234',         // tiene que decir 1234
                    title: 'Titulo del producto',
                    description: 'Dispositivo móvil de Tienda e-commerce', // Tiene que decir esto revisar el pdf
                    picture_url: 'http://localhost:3000/images/products/disruptor.jpg',
                    quantity: 1,
                    unit_price: 999
                }
            ],
            external_reference: 'wintersebast@gmail.com'    // email para validar la certificacion
        }

        mercadopago.preferences.create(preference).then(function(response){
            global.init_point = response.body.init_point;
            res.render('confirm');
        }).catch(function(error){
            console.log(error);
            res.send(error);
        });
    }
}