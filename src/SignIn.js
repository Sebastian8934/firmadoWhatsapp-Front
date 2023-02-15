import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormControlLabel, Switch } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DropzoneDialogBase, DropzoneArea } from 'mui-file-dropzone';
import Image from 'mui-image';
import axios from 'axios';
import config from "./config/config.json"
import img from './media/image.png'
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
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
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);
  const [base64, setBase64] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState({});
  const [failalert, setAlert] = React.useState(false);
  const [succesAlert, setSucces] = React.useState(false);
  const [permitsAlert, setPermitsA] = React.useState(false);
  const [isDisabled, setDisabled] = React.useState(false);
  let base = [];

  React.useEffect(() => {
    async function getUserData() {
      let cryptrUserData = window.location.search.substring(1).split('=');
      await axios.post(config.ipMachine + 'message/cryptr', { cryptr: cryptrUserData[1] }).then(
        (res) => {
          console.log("USER!: ", res.data.result.userDecryptr);
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
        window.close()
          })
      })


    }

    getUserData();

  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isDigital) {
      let res = await fetch(config.ipMachine + 'signature/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDigital: isDigital,
          numeroDocumento: dNumber,
          clave: password,
          base64: base64,
          dni: userInfo.dni

        })
      })
      if (res.status === 200) {
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El documneto ha sido firmado exitosamente', 
          showConfirmButton: true,
        }).then(window.close())
      } else {
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Algo ha salido mal',
        })
      }
    } else {
      let res = await fetch(config.ipMachine + 'signature/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isDigital: isDigital,
          dni: userInfo.dni,
          base64: base64
        })
      })
      if (res.status === 200) {
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El documneto ha sido firmado exitosamente', 
          showConfirmButton: true,
        }).then(window.close())
      } else {
        setDNumber('')
        setPassword('')
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Algo ha salido mal',
        })
      }
    }

  };

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
          <FormControlLabel
            control={<Switch value="remember" color="secondary" name='check' id='check' onChange={(e) => setIsDigital(!isDigital)} />}
            label="Poseo certificado digital"
            labelPlacement='start'
            componentsProps={{ typography: { width: 300 } }}

          />


          <Box component="form" onSubmit={handleSubmit} noValidate sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
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
              sx={{ display: isDigital === false ? 'none' : 'flex', backgroundColor: '#fff', borderRadius: '16px', border: 0, width: '352px' }}
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
              sx={{ display: isDigital === false ? 'none' : 'flex', backgroundColor: '#fff', borderRadius: '16px', width: '352px' }}
            />
            
            <DropzoneArea
              acceptedFiles={['.pdf']}
              showFileNames
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              filesLimit={1}
              maxFileSize={5000000}
              onAdd={newFileObjs => {
                base = newFileObjs[0].data.split(',')
                setFileObjects(newFileObjs);
                setBase64(base[1])
              }}
              onDelete={deleteFileObj => {
                setFileObjects([])
                setOpen(false)
                console.log('onDelete', deleteFileObj);

              }}
              onClose={() => setOpen(false)}
              onSave={() => {
                console.log(base64);
                setOpen(false);
              }}

            />


            <Button
              disabled={isDisabled}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, width: '352px' }}
            >
              Firmar
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
