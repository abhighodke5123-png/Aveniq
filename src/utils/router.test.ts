import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePageFromPath, formatPageUrl, ROUTES } from './router';

test('parsePageFromPath returns correct PageId for various hashes and paths', () => {
  assert.equal(parsePageFromPath(''), 'home');
  assert.equal(parsePageFromPath('/'), 'home');
  assert.equal(parsePageFromPath('#/'), 'home');
  assert.equal(parsePageFromPath('#/services'), 'services');
  assert.equal(parsePageFromPath('/services'), 'services');
  assert.equal(parsePageFromPath('#/industries'), 'industries');
  assert.equal(parsePageFromPath('#/work'), 'work');
  assert.equal(parsePageFromPath('#/about'), 'about');
  assert.equal(parsePageFromPath('#/contact'), 'contact');
  assert.equal(parsePageFromPath('#/start-a-project'), 'contact');
  assert.equal(parsePageFromPath('#/unknown-page'), 'home');
});

test('formatPageUrl produces valid hash urls', () => {
  assert.equal(formatPageUrl('home'), '#/');
  assert.equal(formatPageUrl('services'), '#/services');
  assert.equal(formatPageUrl('industries'), '#/industries');
  assert.equal(formatPageUrl('work'), '#/work');
  assert.equal(formatPageUrl('about'), '#/about');
  assert.equal(formatPageUrl('contact'), '#/contact');
});

test('ROUTES configuration covers all required pages with badges', () => {
  const pages = ['home', 'services', 'industries', 'work', 'about', 'contact'] as const;
  for (const page of pages) {
    assert.ok(ROUTES[page]);
    assert.ok(ROUTES[page].badgeNumber);
    assert.ok(ROUTES[page].label);
  }
});
