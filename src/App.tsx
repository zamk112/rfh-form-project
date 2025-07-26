import type { SubmitHandler } from 'react-hook-form';
import { FormComponent, InputComponent, InputComponentWithError, SelectComponent, SelectComponentWithError } from './Components/FormComponents';
import type { IFormResultsProp, IInputProp, ISelectProp } from './Interfaces/IFormComponentsProps';
import type { TFormInput } from './Types/TFormProps';
import { formattedDateTimeLongNow } from './Utilities/DtHelpers';
import { useCallback, useMemo, useState } from 'react';
import { ReactSelectComponent, ReactSelectComponentWithError } from './Components/ReactSelectComponent';
import type { IOptionType, IReactSelectComponentProp, IReactSelectGroupedComponentProp, IReactSelectGroupProp } from './Interfaces/IReactSelectComponentProps';
import { FormResultComponent } from './Components/FormResultComponents';
import './App.css';

function App() {

  const [formResults, setFormResults] = useState<TFormInput | null>(null);

  // #region Component Prop Definitions
  const firstName: IInputProp = {
    name: 'firstName',
    labelDescription: 'First Name',
    type: 'text',
    rules: { required: 'First Name is required' }
  };

  const lastName: IInputProp = {
    name: 'lastName',
    labelDescription: 'Last Name',
    type: 'text',
    rules: { required: 'Last Name is required' }
  };

  const dob: IInputProp = {
    name: 'dob',
    labelDescription: 'Date of Birth',
    type: 'date',
    rules: { required: 'Date of Birth is required' }
  };

  const tob: IInputProp = {
    name: 'tob',
    labelDescription: 'Time of Birth',
    type: 'time'
  };

  const dateTimeUpdate: IInputProp = {
    name: 'dateTimeUpdate',
    className: 'form-field half-width',
    labelDescription: 'Update Datetime',
    type: 'datetime-local',
  };

  const password: IInputProp = {
    type: 'password',
    name: 'password',
    labelDescription: 'Password',
    rules: {
      validate: (value: string): string | boolean => {
        if (!value || value.trim() === '') {
          return "Password is required";
        }
        else if (value && value.length < 8) {
          return "Password must be at least 8 characters";
        }
        return true;
      }
    },
    htmlAttributes: { autoComplete: 'off' }
  };

  const loudness: IInputProp = {
    type: 'range',
    name: 'loudness',
    labelDescription: 'Loudness',
    // rules: {
    //   min: 0,
    //   max: 100
    // },
    htmlAttributes: { step: 2, min: 0, max: 100 }
  };

  const favMusic: IInputProp = {
    type: 'checkbox',
    name: 'favMusic',
    labelDescription: 'Favourite Music',
    optionsProp: {
      options: [
        { value: 'rap', label: 'Rap' },
        { value: 'hiphop', label: 'Hip Hop' },
        { value: 'rnb', label: 'RnB' },
        { value: 'dance', label: 'Dance' },
      ],
    },
  };

  const favColor: IInputProp = {
    type: 'radio',
    name: 'favColor',
    labelDescription: 'Favourite Colour',
    optionsProp: {
      options: [
        { value: 'blue', label: 'Blue' },
        { value: 'red', label: 'Red' },
        { value: 'green', label: 'Green' },
        { value: 'yellow', label: 'Yellow' },
      ],
    },
  };

  const favNumbers: IInputProp =
  {
    type: 'checkbox',
    name: 'favNumbers',
    labelDescription: 'Favourite Numbers',
    optionsProp: {
      options: [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
      ],
    }
  };

  const gender: ISelectProp = {
    name: 'gender',
    labelDescription: 'Gender',
    options: [
      { value: '', label: '' },
      { value: 'M', label: 'Male' },
      { value: 'F', label: 'Female' },
    ],
    rules: { required: 'Gender is required' }
  };

  const favCar: ISelectProp = {
    name: 'favCar',
    labelDescription: 'Favourite Car',
    options: [
      { value: '', label: '' },
      {
        optGroup: 'Toyota', iSelectOptions: [
          { value: 'toyota-86', label: '86' },
          { value: 'toyota-mr2', label: 'MR2' },
          { value: 'toyota-supra', label: 'Supra' },
          { value: 'toyota-chaser', label: 'Chaser' },
          { value: 'toyota-celica', label: 'Celica' },
          { value: 'toyota-mrs', label: 'MRS' },
        ]
      },
      {
        optGroup: 'Nissan', iSelectOptions: [
          { value: 'nissan-skyline', label: 'Skyline' },
          { value: 'nissan-silvia', label: 'Silvia' },
          { value: 'nissan-350z', label: '350Z' },
          { value: 'nissan-370z', label: '370Z' },
          { value: 'nissan-400Z', label: '400Z' },
          { value: 'nissan-pulsar', label: 'Pulsar' },
          { value: 'nissan-pulsar-sss', label: 'Pulsar SSS' },
          { value: 'nissan-pulsar-gtir', label: 'Pulsar GTIR' },
        ]
      },
      { value: 'go-kart', label: 'Gokart' }
    ],
  };

  const favPets: ISelectProp = {
    name: 'favPets',
    labelDescription: 'Favourite pets',
    multiple: true,
    size: 4,
    options: [
      {
        optGroup: '4-legged pets', iSelectOptions: [
          { value: 'dog', label: 'Dog' },
          { value: 'cat', label: 'Cat' },
          { value: 'hamster', label: 'Hamster', disabled: true },
        ]
      },
      {
        optGroup: 'Flying pets', iSelectOptions: [
          { value: 'parrot', label: 'Parrot' },
        ]
      }
    ],
  };

  const favProgrammingLang: IReactSelectComponentProp<IOptionType> = {
    name: 'favProgrammingLang',
    labelDescription: 'Favourite Programming',
    options: [
      { value: 'CSharp', label: 'C#' },
      { value: 'T-SQL', label: 'T-SQL' },
      { value: 'JavaScript', label: 'JavaScript' },
    ],
    rules: { required: 'Programming Language is required' }
  };

  const favProgFramework: IReactSelectGroupedComponentProp<IOptionType, IReactSelectGroupProp> = {
    name: 'favProgFramework',
    labelDescription: 'Favourite Frameworks',
    options: [
      {
        label: "dotNet",
        options: [
          { label: "Linq", value: "linq" },
          { label: "Dependency Injection", value: "di" },
          { label: "Community Toolkit MVVM", value: "CommunityToolkit.Mvvm" },
        ]
      },
      {
        label: "JavaScript",
        options: [
          { label: "ReactJs", value: "reactjs" },
          { label: "AngularJs", value: "angularjs" },
          { label: "JQuery", value: "jquery" },
          { label: "script.aculo.us", value: "script.aculo.us" }
        ]
      }
    ]
  };

  const favReactLibs: IReactSelectComponentProp<IOptionType> = {
    name: 'favReactLibs',
    labelDescription: 'Favourite React Libs',
    className: 'form-field half-width',
    isMulti: true,
    options: [
      { label: "React Hook Forms", value: "react-hook-form" },
      { label: "React Select", value: "react-select" },
      { label: "React Router", value: "react-router-dom" },
      { label: "React Redux", value: "react-redux" },
    ],
  };

  const favGamesGrouped: IReactSelectGroupedComponentProp<IOptionType, IReactSelectGroupProp> = {
    name: 'favLibGrouped',
    className: 'form-field half-width',
    labelDescription: 'Favourite Games Grouped',
    isMulti: true,
    options: [
      {
        label: "FPS",
        options: [
          { label: "Doom", value: "doom" },
          { label: "Call of Duty", value: "call-of-duty" },
          { label: "Counter Strike", value: "counter-strike" },
          { label: "Halo", value: "halo" }
        ]
      },
      {
        label: "MMORPG",
        options: [
          { label: "Final Fantasy 14", value: "final-fantasy-14" },
          { label: "World of Warcraft", value: "world-of-warcraft" },
          { label: "Phantasy Star Online", value: "phantasy-star-online" },
        ]
      }
    ],
  };
  
  // #endregion

  const defaultValues: TFormInput = {
    dateTimeUpdate: formattedDateTimeLongNow(),
    password: '',
    loudness: 50,
    favMusic: ['rap'],
    favColor: ''
  };

  const onSubmit: SubmitHandler<TFormInput> = useCallback((data) => {
    console.log(data);
    setFormResults(data);
  }, []);

  const formResultData: IFormResultsProp<TFormInput> = useMemo(() => {
    return {
      formValues: formResults!,
      fieldLabels: {
        dob: "Date of Birth",
        tob: "Time of Birth",
        favProgrammingLang: "Favourite Programming Language"
      }
    }
  }, [formResults]);

  return (
    <>
      <h1>React Hook Forms Cheatsheet</h1>
      <FormComponent defaultValues={defaultValues} onSubmit={onSubmit}>
        <h2 className='full-width'>React Controlled Input and Select Components</h2>
        <h3 className='full-width'>Input Components</h3>
        <h4 className='full-width'>Text Based Components</h4>
        <InputComponentWithError {...firstName} />
        <InputComponentWithError {...lastName} />
        <InputComponent name="age" labelDescription="Age" type="number" htmlAttributes={{ step: 2 }} />
        <InputComponentWithError {...password} />
        <h4 className='full-width'>Date Time Based Components</h4>
        <InputComponentWithError {...dob} />
        <InputComponent {...tob} />
        <InputComponent {...dateTimeUpdate} />
        <h4 className='full-width'>Range Based Components</h4>
        <InputComponent {...loudness} />
        <h4 className='full-width'>Radio Button & Checkbox Based Components</h4>
        <InputComponent {...favColor} />
        <InputComponent {...favMusic} />
        <InputComponent {...favNumbers} />
        <h3 className='full-width'>Select Based Components</h3>
        <SelectComponentWithError {...gender} />
        <SelectComponent {...favCar} />
        <SelectComponent {...favPets} />
        <h2 className='full-width'>React Select Component</h2>
        <h3 className='full-width'>Non-Async Select</h3>
        <ReactSelectComponentWithError {...favProgrammingLang} />
        <ReactSelectComponent {...favProgFramework} />
        <h4 className='full-width'>Multi Select</h4>
        <ReactSelectComponent {...favReactLibs} />
        <ReactSelectComponent {...favGamesGrouped} />
      </FormComponent>

      {formResults && <FormResultComponent {...formResultData} />}
    </>
  )
}

export default App;

