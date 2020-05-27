declare module '@rebass/preset' {
  interface Theme {
    [name: string]: any;
  }
  const theme: Theme;
  export default theme;
}
