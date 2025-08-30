console.clear();
App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
	model: async function() {
		const response = await fetch('https://assets.codepen.io/416221/financial-widget-data.json');
		const { data } = await response.json();
		return data;
	}
});

// components
App.FinancialWidgetComponent = Ember.Component.extend({
	classNames: ['widget'],
	tipId: Ember.computed(function() {
		const hash = randomHash();
		return `tip-${hash}`;
	})
});
App.FinancialWidgetButtonComponent = Ember.Component.extend({
	tagName: 'button',
	classNames: ['widget__button'],
	attributeBindings: ['type'],
	type: 'button',
	start: Ember.computed('iconPosition', function() {
		return !this.get('iconPosition') || this.get('iconPosition') === 'start';
	}),
	end: Ember.computed('iconPosition', function() {
		return this.get('iconPosition') === 'end';
	})
});
App.FinancialWidgetProgressComponent = Ember.Component.extend({
	progressId: Ember.computed(function() {
		const hash = randomHash();
		return `progress-${hash}`;
	}),
	filled: Ember.computed('percentValue', 'invert', function() {
		return this.get('invert') ? 1 - this.get('percentValue') : this.get('percentValue');
	})
});
App.FinancialWidgetRowComponent = Ember.Component.extend({
	classNames: ['widget__row'],
	isZero: Ember.computed('value', function() {
		return this.get('value') === 0;
	})
});
App.IconSpriteComponent = Ember.Component.extend({
	tagName: 'svg',
	classNames: ['widget__icon'],
	viewBox: '0 0 16 16',
	width: '16px',
	height: '16px',
	ariaHidden: 'false',
	attributeBindings: ['viewBox', 'width', 'height', 'ariaHidden:aria-hidden'],
	sprite: Ember.computed('name', function() {
		return `#${this.get('name')}`;
	})
});
App.IconSpritesComponent = Ember.Component.extend({
	tagName: 'svg',
	width: '0',
	height: '0',
	display: 'none',
	attributeBindings: ['width', 'height', 'display']
});
App.WidgetGridComponent = Ember.Component.extend({
	classNames: ['widget-grid']
});

// helpers
const locale = {
	lang: 'en-US',
	currency: 'USD'
};
Ember.Handlebars.helper('currency', function(value) {
	const currency = new Intl.NumberFormat(locale.lang, {
		currency: locale.currency,
		style: 'currency',
	});
	return currency.format(value);
});
Ember.Handlebars.helper('decimal', function(value, decimalPoints) {
	const decimal = new Intl.NumberFormat(locale.lang, {
		minimumFractionDigits: decimalPoints,
		maximumFractionDigits: decimalPoints,
	});
	return decimal.format(value);
});
Ember.Handlebars.helper('percent', function(value) {
	const percent = new Intl.NumberFormat(locale.lang, {
		style: 'percent',
	});
	return percent.format(value);
});

// utils
function randomHash() {
	const value = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;

	return Math.round(0xffff * value).toString(16);
}
