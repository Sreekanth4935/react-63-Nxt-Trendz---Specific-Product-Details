// Write your code here
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookie from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class productItemDetails extends Component {
  state = {
    quantity: 1,
    currentProduct: [],
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  increaseQuantity = () => {
    const {quantity} = this.state
    if (quantity >= 0) {
      this.setState(prevState => ({
        quantity: prevState.quantity + 1,
      }))
    }
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  getProductDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookie.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    console.log(response)

    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const similarProductsList = data.similar_products.map(
        eachSimilarProduct => ({
          availability: eachSimilarProduct.availability,
          brand: eachSimilarProduct.brand,
          description: eachSimilarProduct.description,
          id: eachSimilarProduct.id,
          imageUrl: eachSimilarProduct.image_url,
          price: eachSimilarProduct.price,
          rating: eachSimilarProduct.rating,
          style: eachSimilarProduct.style,
          title: eachSimilarProduct.title,
          totalReviews: eachSimilarProduct.total_reviews,
        }),
      )
      const product = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      this.setState({
        currentProduct: product,
        similarProducts: similarProductsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  successView = () => {
    const {quantity, currentProduct, similarProducts} = this.state
    // console.log(currentProduct)
    return (
      <div className="main-container">
        <div className="success-containers">
          <div className="c1">
            <img
              src={currentProduct.imageUrl}
              alt="product"
              className="current-product-image"
            />
          </div>
          <div className="c2">
            <p className="title">{currentProduct.title}</p>
            <h1 className="price">Rs {currentProduct.price}/- </h1>
            <div className="review-container">
              <div className="star-container">
                <div className="stared">
                  <p>{currentProduct.rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                    alt="star"
                    className="rating-star"
                  />
                </div>
              </div>
              <p>{currentProduct.totalReviews} Reviews</p>
            </div>
            <p className="description">{currentProduct.description}</p>
            <p className="availability">
              <span className="span-a">Available: </span>
              {currentProduct.availability}
            </p>
            <p className="availability">
              <span className="span-a">Brand: </span>
              {currentProduct.brand}
            </p>
            <hr />

            <div className="quantity-container">
              <BsDashSquare
                data-testid="minus"
                onClick={this.decreaseQuantity}
              />
              <p>{quantity}</p>
              <BsPlusSquare
                data-testid="plus"
                onClick={this.increaseQuantity}
              />
            </div>
            <div>
              <button type="button" className="button">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <h1>Similar Products</h1>
        <div className="similar-products-container">
          <ul className="ul-container">
            {similarProducts.map(eachProduct => (
              <SimilarProductItem
                eachProduct={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="error-container ">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-view-img"
      />
      <h1>Product Not Found</h1>

      <Link to="/products">
        <button type="button" className="button btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.successView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default productItemDetails
