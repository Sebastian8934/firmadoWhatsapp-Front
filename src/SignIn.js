import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Checkbox, FormControlLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DropzoneDialogBase } from 'material-ui-dropzone';

import config from "./config/config.json"

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const [dNumber, setDNumber] = React.useState([]);
  const [password, setPassword] = React.useState([]);
  const [isDigital, setIsDigital] = React.useState(true);
  const [dni, setDni] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = React.useState([]);
  const [base64, setBase64] = React.useState([])
  let base = [];

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
          dni: dni

        })
      })
      if (res.status === 200) {
        alert('Documento firmado y enviado exitosamente')

        setDNumber('')
        setPassword('')
        setDni('')
        window.location = '/form'
      } else {
        alert('Cuidado las credenciales no se encuentran.')
        setDNumber('')
        setPassword('')
        setDni('')
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
          dni: dni
        })
      })
      if (res.status === 200) {
        alert('Documento firmado y enviado exitosamente')
        setDNumber('')
        setPassword('')
        setDni('')
        window.location = '/form'
      } else {
        alert('Cuidado las credenciales no se encuentran.')
        setDNumber('')
        setPassword('')
        setDni('')
      }
    }

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ¡Bienvenido!
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              sx={{ display: isDigital === false ? 'none' : 'flex' }}
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
              sx={{ display: isDigital === false ? 'none' : 'flex' }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="dni"
              label="DNI"
              type="dni"
              value={dni}
              id="dni"
              onChange={(e) => setDni(e.target.value)}

            />

            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
              Add PDF
            </Button>

            <DropzoneDialogBase
              acceptedFiles={['.pdf']}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              filesLimit={1}
              maxFileSize={5000000}
              open={open}
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
              showPreviews={true}
              showFileNamesInPreview={true}
            />
            <Typography>
              Por favor ingrese con usuario y contraseña de FirmaYa
            </Typography>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" name='check' id='check' onChange={(e) => setIsDigital(!isDigital)} />}
              label="No tengo certificado digital"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Firmar
            </Button>

          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
