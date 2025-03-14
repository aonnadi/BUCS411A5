import React from "react"
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import "./css/base.css"
import "./css/App.css"


//Header component for login.
function Header () {
  return (
    < header >
      <div className="w">
        <div className="login">
          < a href="#">Please login</ a>
        </div>
      </div>
    </header >
  )
}

//Search component for searching a taste.
class Search extends React.Component {
  state = {
    search_item: ""  //Holds for the input user enters.
  }

  //Update search_item when the input changes.
  searchItemChange = (e) => {
    this.setState({
      search_item: e.target.value
    })
  }

  //Sends the input to App when clicks on the button.
  getSearchItemHandler = () => {
    if (this.state.search_item === "sweet" ||
      this.state.search_item === "salty" ||
      this.state.search_item === "sour" ||
      this.state.search_item === "bitter" ||
      this.state.search_item === "savory")  //Search only based on valid input.
    {
      this.props.getSearchItem(this.state.search_item)
    }
    else {
      alert("The search item can only be sweet, salty, sour, bitter, or savory.")
    }
  }

  render () {
    return (
      <div className="content w">
        <div className="logo">Food Search by Taste</div>
        <div className="search">
          <input
            type="search"
            id="searchBar"
            placeholder="Enter Any Taste"
            value={this.state.search_item}
            onChange={this.searchItemChange}
          >
          </input>
          <button
            onClick={this.getSearchItemHandler}
          >Search!
          </button>
        </div>
      </div>
    )
  }
}

//Result component for displaying result.
class Result extends React.Component {
  state = {
    recipe_list: []
  }

  //Call the random recipe api for one recipt.
  queryOneRecipe () {
    return axios({
      url: 'https://api.spoonacular.com/recipes/random',
      params: {
        apiKey: "3c8b0356c9fe4e68838c5a700de725a0"
      }
    }).then(response => {
      return response.data.recipes[0]
    }).catch((error) => {
      console.log(error)
    })
  }

  //Call the taste api for a particular recipe.
  queryRecipeTaste (recipeID) {
    return axios({
      url: 'https://api.spoonacular.com/recipes/' + recipeID + '/tasteWidget.json',
      params: {
        apiKey: "3c8b0356c9fe4e68838c5a700de725a0"
      }
    }).then(response => {
      return response.data
    }).catch((error) => {
      console.log(error)
    })
  }

  //Generate a list of recipes .
  async queryAllRecipes (queryTaste) {
    while (this.state.recipe_list.length < 3) {  //Number of recipes returned.
      const recipe = await this.queryOneRecipe()
      const taste_stats = await this.queryRecipeTaste(recipe.id)
      console.log(taste_stats)
      switch (queryTaste) {
        case "sweet":
          if (taste_stats.sweetness >= 50) {
            this.setState({
              recipe_list: [...this.state.recipe_list, recipe]
            })
          }
          break

        case "salty":
          if (taste_stats.saltiness >= 50) {
            this.setState({
              recipe_list: [...this.state.recipe_list, recipe]
            })
          }
          break

        case "sour":
          if (taste_stats.sourness >= 50) {
            this.setState({
              recipe_list: [...this.state.recipe_list, recipe]
            })
          }
          break

        case "bitter":
          if (taste_stats.bitterness >= 50) {
            this.setState({
              recipe_list: [...this.state.recipe_list, recipe]
            })
          }
          break

        case "savory":
          if (taste_stats.savoriness >= 50) {
            this.setState({
              recipe_list: [...this.state.recipe_list, recipe]
            })
          }
          break
      }

    }
    return true
  }

  //Monitor change of search item and call queryAllRecipes if there is a change.
  componentWillReceiveProps (nextProps) {
    if (nextProps.search_item !== this.props.search_item) {
      //If it is a different input, regenerate the recipe list.
      this.setState({
        recipe_list: []
      })
      this.queryAllRecipes(nextProps.search_item)
    }
  }

  render () {
    return (
      <div className="recipe_list w">
        <ul>
          {this.state.recipe_list.map(item => (
            <li key={item.id} className="recipe">
              <h1 className="recipe_title">{item.title}</h1>
              {/* <div>{item.extendedIngredients}</div> */}
              <div className="recipe_content clearfix">
                <div className="recipe_img">
                  <img src={item.image} />
                </div>
                <div className="recipe_ingredient_list">
                  <h2>Ingredients</h2>
                  <ul>
                    {item.extendedIngredients.map((ingredient) => (
                      <li className="ingredient" key={uuid()}>{ingredient.name}</li>
                    )
                    )}
                  </ul>
                </div>
              </div>
            </li>
          )
          )}
        </ul>
      </div>
    )
  }
}

class App extends React.Component {
  state = {
    search_item: ""
  }

  getSearchItem = (item) => {
    this.setState({
      search_item: item
    })
  }

  render () {
    return (
      <>
        <Header />
        <Search getSearchItem={this.getSearchItem} />
        <Result search_item={this.state.search_item} />
      </>
    )
  }
}

export default App