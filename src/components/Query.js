import React,{useState, useEffect} from 'react';
import '../App.css';
import firebase from 'firebase/app';
import Papa from 'papaparse';

function Query() {
	const [countyData, setData] = useState([]);
	const [countyList, setCounty] = useState([]);
	const [results, setResults] = useState({});
	var cases = "";
	var deaths = "";

	var US_states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virgin Islands", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

	useEffect(()=>{
		function getData(){
			Papa.parse("https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv", {
				header: true,
				download: true,
				dynamicTyping: true,
				skipEmptyLines: true,
				transformHeader: header => header.toLowerCase().replace(/\W/g, "_"),
				complete: function(results) {
					setData(results.data);
				}
			});
		}
	getData();}, []);

	function filterState(data,state) {
		var newData = data.filter(function(row) {
			if (state == row.state) {
				return row;
			}
		})
		return newData.map(function(row) {
			return row.county;
		})
	}

	let ChangeDropDown = (e) => {
		setCounty(filterState(countyData,e.target.value));
	}

	const submitForm = (e) => {
		e.preventDefault();
		const {
			stateDropdown,
			countyDropdown
		} = e.target.elements;

		var obj = countyData.filter(function(x) {
			if(x.state == stateDropdown.value && x.county == countyDropdown.value) {
				return x;
			}
		});
		cases = obj[0].cases;
		deaths = obj[0].deaths;
		setResults({cases:`Cases: ${cases}`,deaths:`Deaths: ${deaths}`});
	}

	const stateForm=
	<div>
		<form onSubmit={submitForm}>
			<div className="form-group" style={{textAlign: "center"}}>
				<label style={{paddingRight: "30px"}}>
					State
					<select
						onChange={ChangeDropDown}
						className="form-control"
						name="stateDropdown"
						id="stateDropdown"
						data-width="fit"
						required>
						<option selected disabled defaultValue>Select State</option>
						{US_states.map((x,y) => <option key={y}>{x}</option>)}
					</select>
				</label>
				<label style={{paddingRight: "30px"}}>
					County
					<select
						className="form-control"
						name="countyDropdown"
						id="countyDropdown"
						data-width="fit"
						required>
						{countyList.map((x,y) => <option key={y}>{x}</option>)}
					</select>
				</label>
				<button type="submit">Submit Form</button>
			</div>
		</form>
		<br />
	</div>;
	return (
		<div>
			<div id="stateHeader">
				<h3>Search by County</h3>
			</div>
			<div id="stateFormDiv">
				{stateForm}
			</div>
			<h4>Results:</h4>
			<h5>{results.cases}</h5>
			<h5>{results.deaths}</h5>
		</div>
	);
}


export default Query;
