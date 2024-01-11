/*
###############################################################################

Delta project

Authors:
Lexington Whalen (@lxaw)

Brief description: 
    When users visit the data download page, they are able to search through
all public files via name and tags and see that data. This file determines
how that searching is done and allows users to download files.

###############################################################################
*/


import React, {useState} from 'react';
import {connect} from 'react-redux';
import {downloadCsvFile} from '../../actions/file'; 
import DataCard from './DataCard';

/*
*/

const DataSetTable = (props) =>{
  /*
  Takes in:
  props.dataSets: an array of csv objects
  */

  // the csv files
  const [dataSets, setCsvFiles] = useState(props.dataSets);
  // text being searched
  const [searchText,setSearchText] = useState("");
  // tags being searched
  // note that this is an array
  const [searchTags,setSearchTags] = useState([]);
  // table data
  const [tableCsvs,setTableCsvs] = useState(props.dataSets);

  // array of files to download
  // arr of file ids
  const [arrFilesToDownload,setArrFilesToDownload] = useState([]);

  // number of files selected
  const [numfilesSelected,setNumFilesSelected] = useState(0);

  // minimum text length for searching
  const textMinLength = (props.textMinLength != undefined) ? props.textMinLength : 3

  // called when checkbox is changed
  const onCheckChange = (csvFileData) =>{
    let newFiles = arrFilesToDownload
    if(!arrFilesToDownload.includes(csvFileData)){
      // add
      newFiles.push(csvFileData)
      // add title
      setArrFilesToDownload(newFiles);
      setNumFilesSelected(numfilesSelected+1) ;
    }else{
      // remove item
      newFiles = newFiles.filter(item=>item.id!==csvFileData.id);
      setArrFilesToDownload(newFiles);
      setNumFilesSelected(numfilesSelected-1) ;
    }
  }
  // when search thru table
  // via name AND tags
  const onSearchChange = () =>{
    // get text for filename search
    const strFileNameSearch = $('#inputSearchFileName').val().toLowerCase()
    // get array for tag search
    const arrStrTagSearch = $("#inputSearchTags").val().split(" ").filter((e)=>{return e != ""}).map(e=>e.toLowerCase());

    // if not enough length, just reset the search
    // go thru tags

    // must immediately update the tag and text so we can use for search
    setSearchText(strFileNameSearch);
    console.log(arrStrTagSearch)
    setSearchTags(arrStrTagSearch);


    var filteredCsvs = props.dataSets;
    // search 1: tags
    // only perform operation of search on tags if there are tags
    // need to make it such that multiple tags means (ie search tag1 and tag2)
    // tag1 & tag2
    filteredCsvs.forEach((csvFile) => {
      if (arrStrTagSearch.length > 0) {
        // get all of the tags of the file
        const arrStrFileTags = csvFile.tags.map((strObj) => strObj.text);

        // we must check if the search tags are a subset of the file tags
        // if yes, return the file
        // else don't
        // check if every tag in arrStrTagSearch has a partial string match in arrStrFileTags
        const allTagsMatch = arrStrTagSearch.every((searchTag) =>
          arrStrFileTags.some((fileTag) => fileTag.includes(searchTag))
        );

        // if all tags have a partial match, keep the file; otherwise, take out
        if (!allTagsMatch) {
          filteredCsvs = filteredCsvs.filter((e) => e !== csvFile);
        }

      }

      // search 2: names
      if (strFileNameSearch.length >= textMinLength) {
        if (!csvFile.name.toLowerCase().includes(strFileNameSearch)) {
          filteredCsvs = filteredCsvs.filter((e) => e !== csvFile);
          return;
        }
      }
    });

    setTableCsvs(filteredCsvs);


  }

  const onSubmit = e =>{
    e.preventDefault();
    arrFilesToDownload.forEach((csvFileData)=>{
      props.downloadCsvFile(csvFileData.id);
    })
  }

  if(dataSets == null) {return};

  return (
    <div data-testid="public_csv_file_table-1">
      <form onSubmit = {onSubmit}>
          <div className="input-group mb-3">
           <div className="input-group-prepend">
             <span className= "input-group-text">File Name</span>
           </div>
            <input id = "inputSearchFileName" type="text" className="form-control" 
            placeholder= {`Enter at least ${textMinLength} characters`} 
            onChange={onSearchChange}/>
          </div>
          <div className="input-group mb-3">
           <div className="input-group-prepend">
             <span className= "input-group-text">Tags</span>
           </div>
            <input id = "inputSearchTags" type="text" className="form-control" 
            placeholder= {"Enter tags to search for, separated by spaces. For instance, you could enter \"cat dog\" to see files with tags of \"cat\" and \"dog\""} 
            onChange={onSearchChange}/>
          </div>


          <div className="row">
            <div className="col-2">
              <h5>File Download Queue</h5>
              <div>
                <p className="fw-bold">
                  {numfilesSelected}
                  {numfilesSelected > 1 || numfilesSelected == 0 ? <> Files</>: <> File</>} Selected For Download
                </p>
              </div>
              <div
                  style={{cursor:'pointer',transition:'color 0.3s'}}
                  onMouseOver={(e) => e.target.style.color='green'}
                  onMouseOut={(e) => e.target.style.color='currentColor'}
              >
                <div className="text-center">
                  <svg onClick={onSubmit} role="button" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="100" height="100" fill="currentColor" 
                  className="bi bi-cloud-download" 
                  viewBox="0 0 16 16"

                  >
                    <path d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"/>
                    <path d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/>
                  </svg>
                </div>
                <p style={{fontSize:'1rem'}}>
                  Click the Cloud to download your files.
                </p>
              </div>
              <div>
                {arrFilesToDownload.map((item,index)=>(
                  <div key={index}>
                    <h6>{item.name}</h6>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-10">
              <div style={{"height":"50rem","overflow":"auto"}} className="d-flex justify-content-center">
                <div className = "row" >
                  {tableCsvs.map((item,index)=>
                    {

                      if(arrFilesToDownload.indexOf(item) >= 0){
                        return(
                            <DataCard 
                              data={item}
                              key = {item.id}
                              link={`/csvs/${item.id}`}
                              linkText={"See DataSet"}
                              parentOnCheckChange={onCheckChange}
                              isDownload={true}
                            />
                        )
                      }else{
                        return(
                          <DataCard 
                            data={item}
                            key = {item.id}
                            link={`/csvs/${item.id}`}
                            linkText={"See DataSet"}
                            parentOnCheckChange={onCheckChange}
                            isDownload={false}
                          />
                        )
                      }
                    }
                      )
                  }
                </div>
                </div>
            </div>
          </div>
          <br/>
      </form>
    </div>
  )
}

const mapStateToProps = state => ({
  auth:state.auth
});

export default connect(
  mapStateToProps,
    {downloadCsvFile}
    )(DataSetTable);