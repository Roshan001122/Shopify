import { useEffect, useState } from "react"
import { addToCart, getAllProducts, getProductsByCategory } from "../../API"
import { Card, List, Image, Typography, Badge, Rate, Button, message, Select, } from "antd"
import { useParams } from "react-router-dom"


function Products() {

const param = useParams()
const [items, SetItems] = useState([])
const [sortOrder, setsortOrder] = useState('az')

 useEffect(() => {

    (param.categoryId ? getProductsByCategory(param.categoryId): getAllProducts()).then(res => {
        SetItems(res.products)
    
    })
 },[param]);

   const getSortedItems = () => {
    const sortedItems = [...items]
    sortedItems.sort((a,b) => {
        const aLowerCaseTitle = a.title.toLowerCase()
        const bLowerCaseTitle = b.title.toLowerCase()
        if(sortOrder === 'az'){
            return aLowerCaseTitle > bLowerCaseTitle ? 1: aLowerCaseTitle === bLowerCaseTitle ? 0 : -1
        }
        else if(sortOrder === 'za'){
            return aLowerCaseTitle < bLowerCaseTitle ? 1: aLowerCaseTitle === bLowerCaseTitle ? 0 : -1
        }
        else if(sortOrder === 'lowHigh'){
            return a.price > b.price ? 1: a.price === b.price ? 0 : -1
        }
        else if(sortOrder === 'highLow'){
            return a.price < b.price ? 1: a.price === b.price ? 0 : -1
        }
    });
    return sortedItems;
   };


    return (
    <div className="productsContainer">

        <div>
            <Typography.Text>View Items Sorted By: </Typography.Text>
            <Select
                onChange={(value) => {
                    setsortOrder(value)
                }} 
                defaultValue={'az'}
                options={[{
                label:'Alphabetically a-z',
                value:'az'
            },
            {
                label:'Alphabetically z-a',
                value:'za'
            },
            {
                label:'Price Low to High',
                value:'lowHigh'
            },
            {
                label:'Price High to Low',
                value:'highLow'
            },
            ]}></Select>
        </div>

        <List 
              grid={{column:3}}
              dataSource={getSortedItems(items)}
              renderItem={(product,index) => {
                return(
                    <Badge.Ribbon className="itemCardBadge" text = {`${product.discountPercentage}% Off`} color="#61c04b">

                    <Card 
                          className="itemcard"
                          title={product.title}
                          key={index}
                          cover={<Image className="itemCardImage" src={product.thumbnail} />}
                          actions={[

                            <Rate value={product.rating} allowHalf disabled />,
                            <AddToCartButton item={product}/>
                          ]}
                          >
                        
                        <Card.Meta title={<Typography.Paragraph>
                                             Price: ${product.price}{"  "}

                                            <Typography.Text delete type="danger">
                                                ${parseFloat(product.price + (product.price * product.discountPercentage/100)).toFixed(2)}
                                            </Typography.Text>

                                          </Typography.Paragraph>}

                                    description={<Typography.Paragraph ellipsis={{rows:2, expandable:true, symbol:'more'}}>
                                                    {product.description}
                                                </Typography.Paragraph> } >

                                    
                        </Card.Meta>

                    </Card>
                    
                    </Badge.Ribbon>
                )
              }}
        >

        </List>
    </div>
);  
}


function AddToCartButton({item}) {
    const [loading,SetLoading] = useState(false)
    
    const addProductToCart = () =>{
            SetLoading(true);
        addToCart(item.id).then(res => {
            message.success(`${item.title} has been added to cart!`)
            SetLoading(false);
        })
    } 

    return(
        <Button type="link" onClick={() => {
            addProductToCart()
        }}
        loading={loading}>Add to Cart</Button>
    )
}

export default Products