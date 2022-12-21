const ADD_TO_CART_EVENT = 'cart/productAdded';
const REMOVE_FROM_CART_EVENT = 'cart/productRemoved';
const ADD_TO_WL_EVENT = 'wl/productAdded';
const REMOVE_FROM_WL_EVENT = 'wl/productRemoved';

class NewsletterForm extends React.Component {
  // state v1
  state = {
    email: '',
    formMessage: '',
    busy: false,
    submitted: false,
    successMessage: '',
  };

  validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  onSubmit = (event) => {
    event.preventDefault();
    // event.target['field-newsletter'].value
    const email = this.state.email;

    this.setState({
      formMessage: '',
    });

    if (!this.validateEmail(email)) {
      this.setState({
        formMessage: 'Please use a valid email',
      });

      return;
    }

    this.setState({
      busy: true,
    });

    setTimeout(() => {
      this.setState({
        busy: false,
        email: '',
        submitted: true,
        successMessage: `${this.state.email} subscrbied!`,
      });
    }, 3000);
  };

  onInputChange = (event) => {
    // currentTarget -> elementul pe care am pus eventul
    // target -> elementul de pe care a plecat eventul
    const email = event.target.value;

    this.setState({
      email,
    });
  };

  render() {
    if (this.state.submitted) {
      return <div className="container">{this.state.successMessage}</div>;
    }

    return (
      <form className="form-newsletter container" onSubmit={this.onSubmit}>
        <label htmlFor="field-newsletter">
          Subscribe to our <span>newsletter</span>
        </label>
        <input
          type="text"
          name="field-newsletter"
          id="field-newsletter"
          value={this.state.email}
          onChange={this.onInputChange}
          placeholder="enter your email address to receive the latest news!"
        ></input>
        <button type="submit">
          {this.state.busy ? '...loading' : 'Subscribe'}
        </button>

        <div className="form-message">{this.state.formMessage}</div>
      </form>
    );
  }
}

const newsletterContainer = document.querySelector('.home-newsletter');
// mount react the good way
ReactDOM.createRoot(newsletterContainer).render(
  <NewsletterForm></NewsletterForm>,
);

class AddToCartButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      busy: false,
      inCart: false,
    };
  }

  onClick = () => {
    this.setState({
      busy: true,
    });

    setTimeout(() => {
      dispatchEvent(
        new CustomEvent(
          this.state.inCart ? REMOVE_FROM_CART_EVENT : ADD_TO_CART_EVENT,
          {
            detail: {
              productId: this.props.productId,
            },
          },
        ),
      );

      this.setState({
        busy: false,
        inCart: !this.state.inCart,
      });
    }, 2000);
  };

  render() {
    const productInCart = this.state.inCart;

    return (
      <button
        onClick={this.onClick}
        type="button"
        title={`${productInCart ? 'Remove' : 'Add'} product to cart`}
        className={`product-control ${productInCart ? 'added' : ''}`}
        disabled={this.state.busy}
      >
        {productInCart
          ? `Product ${this.props.productId} in cart`
          : 'Add to cart'}
        {this.state.busy ? <i className="fas fa-spinner"></i> : <></>}
      </button>
    );
  }
}

class AddToWishlistButton extends React.Component {
  state = {
    inWl: false,
    busy: false,
  };

  onClick = () => {
    this.setState({
      busy: true,
    });

    setTimeout(() => {
      dispatchEvent(
        new CustomEvent(
          this.state.inWl ? REMOVE_FROM_WL_EVENT : ADD_TO_WL_EVENT,
          {
            detail: {
              productId: this.props.productId,
            },
          },
        ),
      );

      this.setState({
        busy: false,
        inWl: !this.state.inWl,
      });
    }, 6000);
  };

  render() {
    const productInWl = this.state.inWl;

    return (
      <button
        onClick={this.onClick}
        type="button"
        title={`${productInWl ? 'Remove' : 'Add'} product to wishlist`}
        className={`product-control ${productInWl ? 'added' : ''}`}
        disabled={this.state.busy}
      >
        {productInWl
          ? `Product ${this.props.productId} in wl`
          : 'Add to wishlist'}
        {this.state.busy ? <i className="fas fa-spinner"></i> : <></>}
      </button>
    );
  }
}

class ProductTileControls extends React.Component {
  render() {
    return (
      <>
        <AddToCartButton productId={this.props.productId}></AddToCartButton>
        <AddToWishlistButton
          productId={this.props.productId}
        ></AddToWishlistButton>
      </>
    );
  }
}
const productTileControls = document.querySelectorAll('.product-tile-controls');
productTileControls.forEach((productTileControl, index) => {
  ReactDOM.createRoot(productTileControl).render(
    <ProductTileControls productId={index}></ProductTileControls>,
  );
});

class CartCounter extends React.Component {
  // never update state directly
  state = {
    cartItemsCount: 0,
    cartItems: [], // array cu ids
  };

  productCartAction = (event) => {
    const { detail, type: eventType } = event;
    const { productId } = detail;
    // no mutating state:
    // slice clones
    const cartItems = this.state.cartItems.slice();

    switch (eventType) {
      case ADD_TO_CART_EVENT:
        // push mutates
        cartItems.push(productId);
        this.setState({
          cartItems,
          cartItemsCount: this.state.cartItemsCount + 1,
        });
        break;
      case REMOVE_FROM_CART_EVENT:
        this.setState({
          cartItemsCount: this.state.cartItemsCount - 1,
          cartItems: cartItems.filter((productId) => {
            return productId !== detail.productId;
          }),
        });
        break;
    }
  };

  componentDidMount() {
    // DOM
    addEventListener(ADD_TO_CART_EVENT, this.productCartAction);
    addEventListener(REMOVE_FROM_CART_EVENT, this.productCartAction);
  }

  render() {
    return (
      <div
        className="header-counter"
        onClick={() => {
          alert(this.state.cartItems);
        }}
      >
        {this.state.cartItemsCount > 0 ? (
          <span className="qty">{this.state.cartItemsCount}</span>
        ) : (
          <></>
        )}
        <i className="fas fa-shopping-cart icon"></i>
      </div>
    );
  }
}

class WishlistCounter extends React.Component {
  state = {
    items: [],
    itemCount: 0,
  };

  wishlistAction = (event) => {
    const { detail, type: eventType } = event;
    const { productId } = detail;

    if (eventType === ADD_TO_WL_EVENT) {
      // slice clones
      const items = this.state.items.slice();
      items.push(productId);

      this.setState({
        items,
        itemCount: this.state.itemCount + 1,
      });

      return;
    }

    if (eventType === REMOVE_FROM_WL_EVENT) {
      this.setState({
        // filter clones
        items: this.state.items.filter((productId) => {
          return productId !== detail.productId;
        }),
        itemCount: this.state.itemCount - 1,
      });

      return;
    }
  };

  componentDidMount() {
    addEventListener(ADD_TO_WL_EVENT, this.wishlistAction);
    addEventListener(REMOVE_FROM_WL_EVENT, this.wishlistAction);
  }

  render() {
    return (
      <div
        className="header-counter"
        onClick={() => {
          alert(this.state.items);
        }}
      >
        {this.state.itemCount > 0 ? (
          <span className="qty">{this.state.itemCount}</span>
        ) : (
          <></>
        )}
        <i className="fas fa-heart icon"></i>
      </div>
    );
  }
}

class HeaderCounters extends React.Component {
  render() {
    return [
      <CartCounter key={0}></CartCounter>,
      <WishlistCounter key={1}></WishlistCounter>,
    ];
  }
}

const headerCounters = document.querySelector('.header-counters');
const root = ReactDOM.createRoot(headerCounters);
root.render(<HeaderCounters></HeaderCounters>);
