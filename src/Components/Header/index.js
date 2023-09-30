import React, { useEffect, useState } from 'react'
import { Badge, Button, Checkbox, Drawer, Form, InputNumber, Menu, Table, message } from 'antd'
import {HomeFilled, ShoppingCartOutlined} from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import Typography from 'antd/es/typography/Typography'
import Input from 'antd/es/input/Input'
import { getCart } from '../../API'


function AppHeader() {

  const navigate = useNavigate()       //react navigate hook to route

  const onMenuClick = (item) => {
        navigate(`/${item.key}`)
  }

  return (
    <div className='appHeader'>

      <Menu 
       className='appmenu'
       onClick={onMenuClick}
       mode='horizontal' 
       items={[
        {
          label: <HomeFilled />,
          key: '',
        },
        {
          label: 'Men',
          key: 'men',
          children:[{
            label: "Men's Shirts",
            key: 'mens-shirts',
          },
          {
            label: "Men's Shoes",
            key: 'mens-shoes',
          },{
            label: "Men's Watches",
            key: 'mens-watches',
          }],
        },
        {
          label: 'Women',
          key: 'women',
          children:[{
            label: "Women's Dresses",
            key: 'womens-dresses',
          },
          {
            label: "Women's Shoes",
            key: 'womens-shoes',
          },
          {
            label: "Women's Watches",
            key: 'womens-watches',
          },
          {
            label: "Women's Bags",
            key: 'womens-bags',
          },
          {
            label: "Women's Bags",
            key: 'womens-bags',
          },
          {
            label: "Women's Jewellery",
            key: 'womens-jewellery',
          },]
        },
        {
          label: 'Fragrances',
          key: 'fragrances',
        },
      ]}/>

      <Typography.Title className="custom-title">Shopify</Typography.Title>

      <AppCart />

    </div>
  );
}

function AppCart() {

  const [cartItems,setCartItems] = useState([])
  const [checkoutDrawerOpen, setcheckoutDrawerOpen] = useState(false)
  const [CartDrawerOpen,setCartDrawerOpen] = useState(false)
  
  useEffect(() => {
    getCart().then(res=>{
      setCartItems(res.products)
    })
  },[])

  const onConfirmOrder = (values) => {
    console.log({values});
    setCartDrawerOpen(false)
    setcheckoutDrawerOpen(false)
    message.success("Your Order has been places successfully!")
  }

  return(

    <div>
    <Badge
     onClick={() => {
      setCartDrawerOpen(true)
    }}
     count= {cartItems.length}
     className='shoppingCartBadge'>

        <ShoppingCartOutlined className='shoppingCartIcon' />
    </Badge>

    <Drawer open={CartDrawerOpen} onClose={() => {
      setCartDrawerOpen(false)
    }}
    
    title='Your Cart'
    contentWrapperStyle={{width:600}}>
    
     <Table 
     pagination={false}
     columns={[{
      title: 'Title',
      dataIndex: 'title'
     },
     {
      title: 'Price',
      dataIndex: 'price',
      render: (value) =>{
        return(
          <span>${value}</span>
        );
      }
     },
     {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (value,record) =>{
        return(
          <InputNumber min={0} defaultValue={value} onChange={(value) => {
           
            setCartItems((pre) => pre.map(cart => {
              if(record.id===cart.id){
                cart.total = cart.price * value;
              }
              return cart;
            })
            );

          }} >

          </InputNumber>
        );
      }
     },
     {
      title: 'Total',
      dataIndex: 'total',
      render: (value) =>{
        return(
          <span>${value}</span>
        );
      }
     },
     ]}
     
     dataSource={cartItems}

     summary={(data) => {
      const total = data.reduce((pre,current) => {
          return pre + current.total
      },0);
          return <span className='total-summary'>Total: ${total}</span>
     }}
      
    />
    <Button type='primary' onClick={() => {
      setcheckoutDrawerOpen(true)
    }}>CheckOut Your Cart</Button>
    </Drawer>

    <Drawer open={checkoutDrawerOpen} onClose={() => {
      setcheckoutDrawerOpen(false)
    }}
    title= 'Confirm Order'
    >

       <Form onFinish={onConfirmOrder}>
          <Form.Item rules={[{
            required:true,
            message: "Please Enter Your Full Name"
          }]} label='Full Name' name='full_name'>
             <Input placeholder='Enter your Full Name' />
          </Form.Item>
          <Form.Item rules={[{
            required:true,
            type:'email',
            message: "Please Enter a valid Email"
          }]} label='Email' name='your_email'>
             <Input placeholder='Enter your Email' />
          </Form.Item>
          <Form.Item rules={[{
            required:true,
            message: "Please Enter Your Address"
          }]} label='Address' name='your_address'>
             <Input placeholder='Enter your Full Address' />
          </Form.Item>

          <Checkbox defaultChecked>Cash on Delivery</Checkbox>
          <br/>
          <Button className='order-confirm-button' type='primary' htmlType='submit'> Confirm Order</Button>
       </Form>

    </Drawer>
    
    </div>
  );
}

export default AppHeader