// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {imageUrl, title, brand, price, rating} = eachProduct

  return (
    <li className="li-element">
      <div>
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="product-img"
        />
        <h1 className="title-similar">{title}</h1>
        <p>by {brand}</p>
        <div className="wt">
          <p className="similar-price">Rs {price}/- </p>
          <p className="ratings">
            {rating}{' '}
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png "
              alt="star"
              className="similar-star"
            />
          </p>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
