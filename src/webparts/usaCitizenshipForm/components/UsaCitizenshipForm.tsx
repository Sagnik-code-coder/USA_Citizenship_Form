import * as React from 'react';
import styles from './UsaCitizenshipForm.module.scss';
import { IUsaCitizenshipFormProps } from './IUsaCitizenshipFormProps';
// import "@pnp/polyfill-ie11";
import { sp } from '@pnp/sp';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


export default class UsaCitizenshipForm extends React.Component<IUsaCitizenshipFormProps, any> {


  constructor(props: any) {
    super(props);
    this.state = {
      currentLegalName: '',
      nameExactlyOnYourPRC: '',
      dob: '',
      countryOfBirth: '',
      countryOfNationality: '',
      maritalStatus: '',
      disabilityImpairment: [],
      emailid: '',
      contact: +9169966666,
      gender: '',
      successMessage: ''
    };
    this.filesave = this.filesave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDisabilityImpairment = this.handleDisabilityImpairment.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  // handle validation for candidateName Field
  private validateForm() {
    const { currentLegalName, nameExactlyOnYourPRC, countryOfBirth, countryOfNationality } = this.state;
    if (!currentLegalName || !nameExactlyOnYourPRC || !countryOfBirth || !countryOfNationality) {
      alert('Please fill in all the required fields.');
      return false;
    }
    return true;
  }


  // reset the field to initial state
private resetForm() {
  const successMessage = this.state.successMessage; // store the success message
  this.setState({
    currentLegalName: '',
    nameExactlyOnYourPRC: '',
    dob: '',
    countryOfBirth: '',
    countryOfNationality: '',
    maritalStatus: '',
    disabilityImpairment: [],
    emailid: '',
    contact: +9169966666,
    gender: ''
  });
  const fileInput = document.getElementById('newfile') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
  this.setState({ successMessage }); // set the success message back after resetting the form
}



  //handle disabilityImpairment field validation
  private handleDisabilityImpairment = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = target;
    const { disabilityImpairment } = this.state;

    if (checked) {
      // Add the selected disabilityImpairment to the array if it doesn't exist
      if (!disabilityImpairment.includes(value)) {
        this.setState((prevState: any) => ({
          disabilityImpairment: [...prevState.disabilityImpairment, value]

        }));
      } console.log(disabilityImpairment);
    } else {
      // Remove the deselected disabilityImpairment from the array
      this.setState((prevState: any) => ({
        disabilityImpairment: prevState.disabilityImpairment.filter((c: any) => c !== value)
      }));
    } console.log(disabilityImpairment);
  };



  //handle field submission
  private async filesave() {
    if (!this.validateForm()) {
      return;
    }
    const fileInput = document.getElementById('newfile') as HTMLInputElement;
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      alert('Please select a file to upload.');
      return;
    }

    const myfile = (document.querySelector("#newfile") as HTMLInputElement).files[0];
    const folderUrl = "/sites/Upload_Form/USA%20Citizenship";
    const fileUrl = `${folderUrl}/${myfile.name}`;

    try {
      // Try to get the file by its server-relative URL
      await sp.web.getFileByServerRelativeUrl(fileUrl).get();
      alert(`File "${myfile.name}" already exists in the folder "${folderUrl}".`);
    } catch (error) {
      if (error.status === 404) {
        if (myfile.size <= 10486760) {
          sp.web.getFolderByServerRelativeUrl(folderUrl).files.add(myfile.name, myfile, true).then(f => {
            console.log("File Uploaded");
            f.file.getItem().then(item => {
              item.update({
                Title: "Metadata Updated",

                CurrentLegalName: this.state.currentLegalName,
                NameExactlyOnYourPRC: this.state.nameExactlyOnYourPRC,
                DOB: this.state.dob,
                CountryOfBirth: this.state.countryOfBirth,
                CountryOfNationality: this.state.countryOfNationality,
                MaritalStatus: this.state.maritalStatus,
                Disabilty: { results: this.state.disabilityImpairment },
                Emailid: this.state.emailid,
                Contact: this.state.contact,
                Gender: this.state.gender
              }).then((myupdate: any) => {
                console.log(myupdate);
                console.log("Metadata Updated");
                this.setState({ successMessage: 'Data saved successfully.' });
                this.resetForm();
              });
            });
          });
        } else {
          sp.web.getFolderByServerRelativeUrl(folderUrl)
            .files.addChunked(myfile.name, myfile)
            .then(({ file }) => file.getItem()).then((item: any) => {
              console.log("File Uploaded");
              return item.update({
                Title: "Metadata Updated",
                CurrentLegalName: this.state.currentLegalName,
                NameExactlyOnYourPRC: this.state.nameExactlyOnYourPRC,
                DOB: this.state.dob,
                CountryOfBirth: this.state.countryOfBirth,
                CountryOfNationality: this.state.countryOfNationality,
                MaritalStatus: this.state.maritalStatus,
                Disabilty: { results: this.state.disabilityImpairment },
                Emailid: this.state.emailid,
                Contact: this.state.contact,
                Gender: this.state.gender
              }).then((myupdate: any) => {
                console.log(myupdate);
                console.log("Metadata Updated");
                this.setState({ successMessage: 'Data saved successfully successfully.' });
                this.resetForm();
              });
            }).catch(console.log);
        }
      } else {
        console.log(`Error while getting the file "${myfile.name}" at "${fileUrl}":`, error);
      }
    }
  }


  private handleChange(event: any) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  
  }

  public render(): React.ReactElement<IUsaCitizenshipFormProps> {
    const { successMessage } = this.state;

    return (
      <section className={`${styles.usaCitizenshipForm}`}>
        <div >
          <h1 className='text-center fs-2 text-primary'>Citizenship Form</h1><br/>
          {successMessage && <p className='fs-5 fw-semibold text-success'>{successMessage}</p>}

          {/* For current legal name */}

          <div className="form-group">
            <label htmlFor="currentLegalName" className="fs-6">Current Legal Name*:</label>
            <input type="text" id="currentLegalName" name="currentLegalName" value={this.state.currentLegalName} onChange={this.handleChange} className="form-control" placeholder="Current Legal Name" required />
          </div>


          {/*Name exactly on your PRC */}


          <div className="form-group">
            <label htmlFor="nameExactlyOnYourPRC" className="fs-6">Name exactly as it appears on your Permanent Resident Card (PRC)*:</label>
            <input type="text" className="form-control" id="nameExactlyOnYourPRC" name="nameExactlyOnYourPRC" value={this.state.nameExactlyOnYourPRC} onChange={this.handleChange} placeholder="Enter name as it appears on your PRC" required />
          </div>




          {/* Date Of Birth */}


          <div className="form-group">
            <label htmlFor="dob" className="fs-6">Date of Birth:</label>
            <input type="date" className="form-control" id="dob" name="dob" value={this.state.dob} onChange={this.handleChange}  />
          </div>


          {/* Marital Status */}



          <div className="form-group">
            <label htmlFor="maritalStatus" className="fs-6">Marital Status:</label>
            <select className="form-control" id="maritalStatus" name="maritalStatus" value={this.state.maritalStatus} onChange={this.handleChange}>
              <option value="">-- Select Marital Status --</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>


          {/* Disability Imparent */}
          <div className='form-group'>
            <label className="form-check-label fs-6" htmlFor="flexCheckDefault">Disability Imparent:</label><br />
            <div>
              <input className="form-check-input" type="checkbox" name="I am deaf or hearing impaired and need a sign language interpreter who uses my language" value="I am deaf or hearing impaired and need a sign language interpreter who uses my language" onChange={this.handleDisabilityImpairment} checked={this.state.disabilityImpairment.includes("I am deaf or hearing impaired and need a sign language interpreter who uses my language")} />
              <label className="form-check-label fs-6" htmlFor="flexCheckDefault">I am deaf or hearing impaired and need a sign language interpreter who uses my language</label><br />
            </div>
            <div>
              <input className="form-check-input" type="checkbox" name="I use a wheelchair" value="I use a wheelchair" onChange={this.handleDisabilityImpairment} checked={this.state.disabilityImpairment.includes("I use a wheelchair")} />
              <label className="form-check-label fs-6" htmlFor="flexCheckDefault"> I use a wheelchair</label><br />
            </div>
            <div>
              <input className="form-check-input" type="checkbox" name="I am blind or sight impaired" value="I am blind or sight impaired" onChange={this.handleDisabilityImpairment} checked={this.state.disabilityImpairment.includes("I am blind or sight impaired")} />
              <label className="form-check-label fs-6" htmlFor="flexCheckDefault">I am blind or sight impaired</label><br />
            </div>
            <div> <input className="form-check-input" type="checkbox" name="I will need another type of accommodation" value="I will need another type of accommodation" onChange={this.handleDisabilityImpairment} checked={this.state.disabilityImpairment.includes("I will need another type of accommodation")} />
              <label className="form-check-label fs-6" htmlFor="flexCheckDefault">I will need another type of accommodation</label><br />
            </div>

          </div>


          {/* Country of Nationality */}


          <div className="form-group">
            <label htmlFor="countryOfNationality" className="fs-6">Country Of Nationality*:</label>
            <select className="form-control" id="countryOfNationality" name="countryOfNationality" value={this.state.countryOfNationality} onChange={this.handleChange} required>
              <option value="">-- Select Country Of Nationality --</option>
              <option value="">Select</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Australia">Australia</option>
              <option value="UAE">UAE</option>
            </select>
          </div>

          {/* Country of Birth */}


          <div className="form-group">
            <label htmlFor="countryOfBirth" className="fs-6">Country Of Birth*:</label>
            <select className="form-control" id="countryOfBirth" name="countryOfBirth" value={this.state.countryOfBirth} onChange={this.handleChange} required>
              <option value="">-- Select Country Of Birth* --</option>
              <option value="">Select</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Australia">Australia</option>
              <option value="UAE">UAE</option>
            </select>
          </div>


          {/* Email Id */}


          <div className="form-group">
            <label htmlFor="emailid" className="fs-6">Email Id:</label> <br />
            <input type="email" className="form-control" id="emailid" name="emailid" value={this.state.emailid} onChange={this.handleChange} />
          </div>

          {/* Contact */}

          <div className="form-group">
            <label htmlFor="contact" className="fs-6">Contact Number:</label> <br />
            <input type="tel" className="form-control" id="contact" name="contact" value={this.state.contact} onChange={this.handleChange}  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
          </div>

          {/* Gender */}

          <div className="form-group">
            <label htmlFor="gender" className="fs-6">Gender:</label> <br />
            <select className="form-control" id="gender" name="gender" value={this.state.gender} onChange={this.handleChange} required>
              <option value="">-- Select gender --</option>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Upload file */}

          <div className="mb-3">
            <label htmlFor="formFile" className="form-label fs-6">Upload Identity Proof:</label><br />
            <input className="form-control" type="file" name="myFile" id="newfile"></input>
          </div>
          <div>
            <button className="btn btn-primary" type='submit' onClick={this.filesave}>
              Submit
            </button>
          </div>

        </div>
      </section>
    );
  }
}

