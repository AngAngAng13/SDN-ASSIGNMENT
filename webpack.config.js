
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  entry: './src/client/main.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensionAlias: {
     '.js': ['.ts', '.js'],
     '.mjs': ['.mts', '.mjs'],
     '.cjs': ['.cts', '.cjs']
    } 
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src', 'public', 'javascripts'),
  },
};

export default config;