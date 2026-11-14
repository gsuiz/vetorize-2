# Convenções de nomes

- Identificadores internos em inglês. Textos da interface, README e comentários permanecem em português.
- Componentes e tipos em `PascalCase`; arquivos de componentes usam o nome do componente exportado.
- Componentes indicam sua responsabilidade: `PointInputForm`, `TransformationForm`, `RegressionSettingsForm`, `GeometrySidebar` e `TransformationChart`.
- Funções e variáveis em `camelCase`. Funções descrevem uma ação, como `calculateLinearRegression`, `sortPointsByCentroidAngle` e `multiplyMatrixByScalar`.
- Hooks começam com `use`, como `useRegression`. Setters seguem `set` + nome do estado, como `setVariableLabels`.
- Booleanos expressam uma condição, usando prefixos como `is`, `has` ou `can` quando apropriado.
- Constantes compartilhadas usam `UPPER_SNAKE_CASE`, como `BASE_LAYOUT` e `REFLECTION_MATRIX_X`.
- Estados e coleções explicitam o conteúdo: `coordinateInputs`, `selectedPointIndices` e `transformationUndoStack`.
- Nomes matemáticos refletem seu significado: `slope`, `intercept`, `designMatrix`, `determinant` e `regressionCoefficients`.
- Coordenadas `x` e `y` e índices locais curtos são aceitáveis quando seu significado é evidente. Evite abreviações opacas como `mtx`, `aux` e `transMtx`.
- Classes de formulário indicam o elemento a que se aplicam: `inputClassName` e `selectClassName`.
