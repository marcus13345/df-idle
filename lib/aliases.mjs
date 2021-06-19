import path from 'path';

const moduleAliases = {
	"@theme": "./out/src/ui/Theme.js"
};

const getAliases = () => {
  const base = process.cwd();
  const aliases = moduleAliases || {};
  const absoluteAliases = Object.keys(aliases).reduce((acc, key) =>
    aliases[key][0] === '/'
      ? acc
      : { ...acc, [key]: 'file:///' + path.join(base, aliases[key]) },
    aliases)
  return absoluteAliases;
}

const isAliasInSpecifier = (path, alias) => {
  return path.indexOf(alias) === 0
    && (path.length === alias.length || path[alias.length] === '/')
}

const aliases = getAliases();

export const resolve = (specifier, parentModuleURL, defaultResolve) => {
  const alias = Object.keys(aliases).find((key) => isAliasInSpecifier(specifier, key));

  const newSpecifier = alias === undefined
    ? specifier
    : path.join(aliases[alias], specifier.substr(alias.length));

  return defaultResolve(newSpecifier, parentModuleURL);
}