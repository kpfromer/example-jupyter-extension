import React, { useState, useEffect } from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { ThemeProvider } from 'theme-ui';
import { Box, Image, Text, Heading, Button } from 'rebass';
import { Provider, useSelector, useDispatch } from 'react-redux';
import theme from '@rebass/preset';
import { store, RootState, counterSlice } from './store';

/**
 * The root react component for the juypter extension
 */
export class ExtensionWidget extends ReactWidget {
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    );
  }
}

interface APODResponse {
  copyright: string;
  date: string;
  explanation: string;
  media_type: 'video' | 'image';
  title: string;
  url: string;
}

/**
 * Gets random date for nasa image api.
 */
function randomDate() {
  const start = new Date(2010, 1, 1);
  const end = new Date();
  const random = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return random.toISOString().slice(0, 10);
}

/**
 * Handy hook to make requests simpler
 * @param requestFn function that is called to get the url to request
 * @param initialFetch run request on mount
 */
function useRequestHandler<T>(
  requestFn: () => string,
  initialFetch = false
): {
  request: () => void;
  data: T | null;
  error: any;
  loading: boolean;
} {
  const [data, setData] = useState<null | T>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(initialFetch);

  function request(): void {
    const url = requestFn();
    setLoading(true);
    fetch(url)
      .then((res) => res.json() as Promise<T>)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (initialFetch) {
      request();
    }
  }, [initialFetch]);

  return { request, data, error, loading };
}

function App(): JSX.Element {
  const { loading, data, error, request } = useRequestHandler<APODResponse>(
    () =>
      `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randomDate()}`,
    true
  );
  if (loading) {
    return <Text>Loading</Text>;
  }
  if (error) {
    return <Text>Error: {error}</Text>;
  }
  return (
    <Box height="100%" sx={{ overflowY: 'scroll' }}>
      <Image src={data.url} />
      <Heading textAlign="center">{data.title}</Heading>
      <Button onClick={() => request()}>New Image</Button>
      <Counter />
      <CounterButton />
    </Box>
  );
}

function Counter(): JSX.Element {
  const count = useSelector<RootState>((state) => state);
  return (
    <Box>
      <Text>{count}</Text>
    </Box>
  );
}

function CounterButton(): JSX.Element {
  const dispatch = useDispatch();
  const {
    actions: { increment, decrement }
  } = counterSlice;

  return (
    <Box>
      <Button onClick={() => dispatch(increment())}>+</Button>
      <Button onClick={() => dispatch(decrement())}>-</Button>
    </Box>
  );
}
