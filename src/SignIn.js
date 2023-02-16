import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormControlLabel, Switch } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DropzoneArea } from 'mui-file-dropzone';
import Image from 'mui-image';
import axios from 'axios';
import config from "./config/config.json"
import img from './media/image.png'
import Swal from 'sweetalert2';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#063970',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    secondary: {
      main: '#397006'
    }
  },
  root: {
    justifyContent: 'center'
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundImage:
            "url(./media/photo-1534796636912-3b95b3ab5986.jpeg)"
        }
      }
    }
  }
});

export default function SignIn() {

  const [dNumber, setDNumber] = React.useState([]);
  const [password, setPassword] = React.useState([]);
  const [isDigital, setIsDigital] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);
  const [base64, setBase64] = React.useState("");
  const [userInfo, setUserInfo] = React.useState({});
  const [isDisabled, setDisabled] = React.useState(false);

  const [close, setClose] = React.useState(false);

  React.useEffect(() => {
    async function getUserData() {
      let cryptrUserData = window.location.search.substring(1).split('=');
      await axios.post(config.ipMachine + 'message/cryptr', { cryptr: cryptrUserData[1] }).then(
        (res) => {
          setUserInfo(res.data.result.userDecryptr);
        }
      ).catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Sentimos los inconvenientes no parece tener credenciales válidas',
        }).then(
          function () {
            setDisabled(true)
            setClose(true)
          })
      })
    }
    getUserData();


  }, []);

  React.useEffect(() => {
    if (close) {
      let ventana = window.self;
      ventana.opener = window.self;
      ventana.close()
    }
  }, [close])
  

  const handleSubmit = async (event) => {
    Swal.fire({
      title: 'Enviando',
      text: 'Firmando Documentos',
      didOpen: () =>{
        Swal.showLoading()
      }
    })
    event.preventDefault();
    if (isDigital) {
      axios.post(config.ipMachine + 'signature/', {
        isDigital: isDigital,
        numeroDocumento: dNumber,
        clave: password,
        base64: base64,
        dni: userInfo.dni

      }).then(() => {
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El documento ha sido firmado exitosamente',
          showConfirmButton: true,
        }).then(function (){setClose(true)})
      }).catch((err) => {
        console.log(err.response.data.result.errors);
        let key = Object.keys(err.response.data.result.errors)
        let message = `${key}: ${err.response.data.result.errors[key]}` || "Algo ha salido mal"
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
        })
      });
    } else {
      await axios.post(config.ipMachine + 'signature/', {
        isDigital: isDigital,
        dni: userInfo.dni,
        base64: base64
      }).then(() => {
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El documento ha sido firmado exitosamente',
          showConfirmButton: true,
        }).then(function (){setClose(true)})
      }).catch((err) => {
        console.log(err.response.data.result.errors);
        let key = Object.keys(err.response.data.result.errors)
        let message = `${key}: ${err.response.data.result.errors[key]}` || "Algo ha salido mal"
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,
        })

      });

    }

  };

  React.useEffect(() => {
    if (fileObjects[0] !== undefined) {
      getBase64(fileObjects[0])
        .then(result => {
          result = result.split(",");
          setBase64(result[1])
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [fileObjects, base64]);

  function getBase64(file) {
    return new Promise(resolve => {
      let baseURL = "";
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  }

  async function addPdfArea(newFileObjs) {
    if (newFileObjs[0] !== undefined) {
      setFileObjects(newFileObjs)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ alignItems: 'center', borderRadius: '16px', backgroundColor: '#fff' }} >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

          }}
        >
          <Image src={`${img}`} width={100} sx={{ marginTop: 2 }} />
          <Typography component="h1" variant="h4" color={'#063970'}>
            Bienvenido
          </Typography>
          <Typography>{userInfo.name}</Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <FormControlLabel
            control={<Switch value="remember" color="secondary" name='check' id='check' onChange={(e) => setIsDigital(!isDigital)} />}
            label="Poseo certificado digital"
            labelPlacement='start'
            sx={{justifyContent: "space-between",width:"100%",margin:0}}
          />
            <TextField
              margin="normal"
              required
              fullWidth
              id="documentNumber"
              label="Numero de documento"
              name="documentNumber"
              autoComplete="documentNumber"
              autoFocus
              value={dNumber}
              onChange={(e) => setDNumber(e.currentTarget.value)}
              sx={{ display: isDigital === false ? 'none' : 'flex', backgroundColor: '#fff', borderRadius: '16px', border: 0, width: '100%' }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              value={password}
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              sx={{ display: isDigital === false ? 'none' : 'flex', backgroundColor: '#fff', borderRadius: '16px', width: '100%' }}
            />

            <DropzoneArea
              acceptedFiles={['.pdf']}
              showFileNames
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              filesLimit={1}
              maxFileSize={5000000}
              onChange={(newFileObjs) => {
                addPdfArea(newFileObjs)

              }}
              onDelete={deleteFileObj => {
                setFileObjects([])
              }}
            />


            <Button
              disabled={isDisabled}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, width: '100%' }}
            >
              Firmar
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
