///// Main Channel (Event Transfer)

let eBus = new Vue();

/////////// MAIN PRODUCT /////////////

Vue.component('socks', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
	<div>
		<div class="product">
		  
	      	<div class="product-image">
			  <img v-bind:src="image"/>
		  	</div>
		  
		  	<div class="product-info">
			  	<h1 :style="{margin: '0 0 5px', fontFamily: 'Roboto'}">{{ title }}</h1>
			  	<p :style="{margin: '5px 0'}" v-if="inStock">In Stock</p>
			  	<p :style="{margin: '5px 0'}" v-else>Out Of Stock</p>
			  	<p :style="{margin: '10px 0 0'}"> Shipping : {{ shipping }}</p>
			  
			  	<ul :style="{margin: '.9em 0'}">
				  	<li v-for="detail in details">{{ detail }}</li>
			  	</ul>
			  
			  	<div class="color-box"
			  	v-for="(variant, index) in variants"
			  	:key="variant.variantId"
			  	:style="{backgroundColor: variant.variantColor, display: 'inline-block'}"
			  	@mouseover="updateProduct(index)"></div>

			  	<button 
			  	v-on:click="addToCart"
			  	:style="{display: 'block'}"
			  	:disabled="!inStock" 
			  	:class="{ disabledBtn: !inStock }">Add To Cart</button>
			  
		  	</div>
		  	<div class="cf"></div>
		</div>
		
		<socks-tabs :reviews="reviews"></socks-tabs>

  		</div>
	`,
	data() {
		return {
			product: "Socks",
			brand: 'Vue Yess',
			selectedVariant: 0,
			details: ['80% cotton', '20% polyster', 'Gender-neutral'],
			variants: [
				{
				variantId: 2234,
				variantColor: "#1d7e47",
				variantImage: "./imgs/sock1.png",
				variantQuantity: 10
			},
				{
				variant: 2235,
				variantColor: "#485c75",
				variantImage: "./imgs/sock2.png",
				variantQuantity: 0
			}
			],
			reviews: []
			
		}
	},
	methods: {
		addToCart() {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
		},
		updateProduct(index) {
			this.selectedVariant = index;
		}
	},
	computed: {
		title() {
			return this.brand + ' ' + this.product;
		},
		image() {
			return this.variants[this.selectedVariant].variantImage;
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQuantity;
		},
		shipping() {
			if(this.premium) {
				return "Free";
			} else {
				return "2.99$";
			}
		}
	},
	mounted() {
		eBus.$on('review-submitted', socksReview => this.reviews.push(socksReview))
	}
});

/////// SOCKS REVIEW /////////////

Vue.component('socks-review', {
	template: `
<form class="review-form" @submit.prevent="onSubmit">
	<p v-if="errors.length">
		<b :style="{textDecoration: 'underline', color: 'darkred'}">Please Correct The Following Errors :(</b>
		<ul>
			<li v-for="error in errors" v-bind:style="{color: redColor}">{{error}}</li>
		</ul>
	</p>
	<p>
		<label for="name">Name: </label>
		<input type="text" id="name" v-model="name" placeholder="name">
	</p>
	<p>
		<label for="review">Review: </label>
		<textarea id="review" v-model="review" placeholder="review"></textarea>
	</p>
	<p>
		<label for="rating">Rating: </label>
		<select id="rating" v-model.number="rating">
			<optgroup label="Rating Stars">
				<option value="1">1 Star</option>
				<option value="2">2 Stars</option>
				<option value="3">3 Stars</option>
				<option value="4">4 Stars</option>
				<option value="5">5 Stars</option>
			</optgroup>
		</select>
	</p>
	<p>
		<input type="submit" value="Submit">
	</p>
</form>
`,
	data() {
		return {
			name: null,
			rating: null,
			review: null,
			errors: [],
			redColor: "red"
		}
	},
	methods: {
		onSubmit() {
			if (this.name && this.review && this.rating) {
				let socksReview = {
					name: this.name,
					review: this.review,
					rating: this.rating
				}
				eBus.$emit('review-submitted', socksReview);
				this.name = null;
				this.review = null;
				this.rating = null;
			} else {
				if(!this.name) { this.errors.push('Name Required'); }
				if(!this.review) { this.errors.push('Review Required'); }
				if(!this.rating) { this.errors.push('Rating Required'); }
			}
		}
	}
});

///////// TABS COMPONENT ///////////

Vue.component('socks-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}
	},
	template: `
<div>
	<div>
		<span class="tabs"
		:class="{activeTab: selectedTab === tab}"
		v-for="(tab, index) in tabs"
		:key="index"
		@click="selectedTab = tab">{{tab}}</span>
	</div>

	<div id="comment" v-show="selectedTab === 'Make a Review'">
  		<socks-review></socks-review>
	</div>

  	<div id="reviews" v-show="selectedTab === 'Reviews'">
		<h2>Reviews</h2>
		<p v-if="!reviews.length">There Are No Reviews Yet.</p>
		<ul :style="{listStyle: 'none', margin: 0, padding: 0}">
			<li :style="{border: '1px solid #CCC', padding: '10px', margin: '5px 25px'}" v-for="(review, index) in reviews" :key="index">
				<p :style="{margin: '.5em 0'}"><b :style="{color: '#000'}">Name:</b> {{review.name}}</p>
				<p :style="{margin: '.5em 0'}"><b :style="{color: '#000'}">Review:</b> {{review.review}}</p>
				<p :style="{margin: '.5em 0'}"><b :style="{color: '#000'}">Staring:</b> {{review.rating + " Stars"}}</p>
			</li>
		</ul>
	</div>
</div>
		`,
	data() {
		return {
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Make a Review'
		}
	}
});

//////////// MAIN VUE INSTANCE ///////////
let vm = new Vue({
	el: "#app",
	data: {
		premium: false,
		cart: []
	},
	methods: {
		updateCart(id) {
			this.cart.push(id);
		},
	}
});