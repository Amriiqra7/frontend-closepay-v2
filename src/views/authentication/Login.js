'use client';

import React from "react";
import { Box, Button, Card, CardContent, TextField, Typography, Link, Avatar, Paper } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Logo component (replace src with your logo path)
function Logo() {
  return (
    <Box display="flex" justifyContent="center" mb={2}>
      <Avatar
        src="/assets/images/auth/logo.png"
        alt="Logo"
        sx={{ width: 80, height: 80, bgcolor: 'transparent' }}
        variant="square"
      />
    </Box>
  );
}



// Main Login Form
function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    // For now, just redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <Card elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 0, width: '100%' }}>
      <CardContent>
        <Logo />
        <Typography variant="h4" fontWeight={600} align="center" mb={1} sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
          Login
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" mb={3} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          Masukkan username/email dan password<br />
          Anda untuk masuk ke dashboard
        </Typography>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue="Kantin FkI 12"
            InputProps={{ sx: { borderRadius: 4 } }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            defaultValue="**********"
            InputProps={{ sx: { borderRadius: 4 } }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600, borderRadius: 4, bgcolor: '#111', '&:hover': { bgcolor: '#222' } }}
          >
            Masuk
          </Button>
        </Box>
        <Box textAlign="center" mt={3}>
          <Link href="#" underline="hover" color="text.secondary" fontSize={16}>
            Lupa Password
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Login() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f7f7f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1100,
          minHeight: { xs: 'auto', md: 650 },
          borderRadius: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          overflow: 'hidden',
        }}
      >
        {/* Left: Login Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: "100%",
            py: { xs: 3, md: 0 },
          }}
        >
          <LoginForm />
        </Box>
        {/* Right: Centered Image Only */}
        <Box
          sx={{
            flex: 1,
            minHeight: { xs: 200, md: '100%' },
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#111',
            position: 'relative',
          }}
        >
          <Box 
            sx={{ 
              width: '90%', 
              height: '90%', 
              position: 'relative',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Image
              src="/assets/images/bg-login.png"
              alt="Login Illustration"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'contain', borderRadius: 16 }}
              priority
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
