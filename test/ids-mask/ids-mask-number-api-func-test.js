import MaskAPI from '../../src/ids-mask/ids-mask-api';
import { numberMask } from '../../src/ids-mask/ids-masks';

let api;

describe('IdsMaskAPI (Number)', () => {
  beforeEach(() => {
    api = new MaskAPI();
  });

  afterEach(() => {
    api = null;
  });

  it('can handle simple number masking', () => {
    let textValue = '123456';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'en-US',
        allowDecimal: true,
        integerLimit: 4,
        decimalLimit: 2
      }
    };
    let result = api.process(textValue, opts);

    // If decimal isn't added manually, the decimal and values after it are thrown out
    expect(result.conformedValue).toEqual('1234');

    textValue = '1234.56';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('1234.56');
  });

  // @TODO Re-enable this when `Locale.formatNumber()` is implemented.
  it.skip('should process numbers with thousands separators', () => {
    // Handle big numbers with thousands separators
    let textValue = '1111111111';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'en-US',
        allowThousands: true,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('1,111,111,111');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '2222222222.33';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('2,222,222,222.33');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-4444444444.55';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-4,444,444,444.55');

    // Handle Numbers with a prefix (currency)
    opts.patternOptions.allowNegative = false;
    opts.patternOptions.integerLimit = 4;
    opts.patternOptions.prefix = '$';
    textValue = '2345';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('$2,345');
  });

  it('can handle numbers with prefixes or suffixes', () => {
    // Handle Numbers with a prefix (currency)
    let textValue = '2345';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'en-US',
        allowNegative: false,
        integerLimit: 4,
        prefix: '$'
      }
    };
    let result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('$2345');

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '100';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('100%');
  });

  it('should process arabic numbers', () => {
    // Handle big numbers with thousands separators
    let textValue = '١٢٣٤٥٦٧٨٩٠';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        allowThousands: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '١٢٣٤٥٦٧٨٩٠.٣٣';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('١٢٣٤٥٦٧٨٩٠.٣٣');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-١٢٣٤٥٦٧٨٩٠.٥٥';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-١٢٣٤٥٦٧٨٩٠.٥٥');

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '١٢٣٤';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('١٢٣%');
  });

  it('should process hindi (devanagari) numbers', () => {
    // Handle big numbers with thousands separators
    let textValue = '१२३४५६७८९०';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'hi-ID',
        allowThousands: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('१२३४५६७८९०');

    // Handle numbers with a decimal
    opts.patternOptions.allowDecimal = true;
    textValue = '१२३४५६७८९०.११';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('१२३४५६७८९०.११');

    // Handle Negative numbers
    opts.patternOptions.allowNegative = true;
    textValue = '-१२३४५६७८९०.११';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-१२३४५६७८९०.११');
  });

  it('should process hindi (devanagari) numbers with a percentage', () => {
    // Handle big numbers with thousands separators
    let textValue = '१२३४५६७८९०';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        locale: 'hi-ID',
        allowThousands: false,
        integerLimit: 10
      }
    };
    let result = api.process(textValue, opts);

    // Handle Numbers with a suffix (percent)
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = '१२३४';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('१२३%');

    // Block letters on numbers
    opts.patternOptions.integerLimit = 3;
    opts.patternOptions.prefix = '';
    opts.patternOptions.suffix = '%';
    textValue = 'ोवमा';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('%');
  });

  it('should process chinese (financial) numbers', () => {
    const textValue = '壹贰叁肆伍陆柒';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        allowThousands: false,
        integerLimit: 10
      }
    };
    const result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('壹贰叁肆伍陆柒');
  });

  it('should process chinese (normal) numbers', () => {
    const textValue = '一二三四五六七七九';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        allowThousands: false,
        integerLimit: 10
      }
    };
    const result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('一二三四五六七七九');
  });

  it('Should process number masks with leading zeros', () => {
    // Handle big numbers with thousands separators
    let textValue = '00001';
    const opts = {
      selection: {
        start: 0
      },
      pattern: numberMask,
      patternOptions: {
        allowLeadingZeros: true,
        allowThousands: true,
        allowDecimal: true,
        allowNegative: true,
        integerLimit: 10,
        decimalLimit: 3,
        locale: 'en-US'
      }
    };
    let result = api.process(textValue, opts);

    expect(result).toBeDefined();
    expect(result.conformedValue).toEqual('00001');

    textValue = '-00000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('-00000.123');

    textValue = '00000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('00000.123');

    /*
    // @TODO Re-enable this when `Locale.formatNumber()` is implemented.
    textValue = '10000';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000');

    textValue = '10000.123';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000.123');

    textValue = '10000.100';
    result = api.process(textValue, opts);

    expect(result.conformedValue).toEqual('10,000.100');
    */
  });
});
