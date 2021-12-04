interface WhenMockedFn extends jest.Mock {
  resetWhenMock(): WhenMockedFn;

  __matchers__: Matcher[];
}

function match(matchers: Matcher[], args: any[]): Matcher | undefined {
  // Leverage jest matcher to match objects
  for (const matcher of matchers) {
    try {
      expect(args).toEqual(matcher.matcher);
      return matcher;
    } catch (e) {
    }
  }
  return undefined;
}

class Matcher {
  public readonly matcher: any;
  // @ts-ignore
  public mockImpl: Function;

  constructor(matcher: any) {
    this.matcher = matcher;
  }
}

// no reset mock method is required in this class as fn is only modified when
// (not)calledWith is called on a WhenMock object - in this case, a mocked
// function is not returned, and not a WhenMock object.
// Therefore, the reset method is required on the mocked function, not a WhenMock
class WhenMock {
  private readonly fn: jest.Mock;
  private readonly originalMock: ((...args: any) => any) | undefined;

  public constructor(fn: jest.Mock) {
    this.fn = fn;
    // Store original mock implementation so the user can reset the custom mock this adds
    this.originalMock = fn.getMockImplementation();
  }

  // Replace the jest mock functions with custom ones that ...
  private mockFunctions(matchers: any, shouldMatch: boolean): Matcher[] {
    const matchObjs: Matcher[] = [];
    for (const matcher of matchers) {
      const matcher = new Matcher(matchers);
      this.fn.mockReturnValue = (returnValue: any) => this.mockReturnFn(matcher, shouldMatch, () => returnValue);
      this.fn.mockResolvedValue = (returnValue: any) => this.mockReturnFn(matcher, shouldMatch, () => Promise.resolve(returnValue));
      this.fn.mockRejectedValue = (error: any) => this.mockReturnFn(matcher, shouldMatch, () => Promise.reject(error));
      matchObjs.push(matcher);
    }
    return matchObjs;
  }

  private mock(matchers: any, shouldMatch: boolean): jest.Mock {
    const that = this;
    // @ts-ignore - ignore typescript checks so we can add a function
    this.fn.resetWhenMock = function (): WhenMockedFn {
      // Restore the original mock if it exists
      if (that.originalMock) this.mockImplementation = that.originalMock;
      // Otherwise restore default mock implementation (return undefined)
      else this.mockImplementation(() => {
      });
      // @ts-ignore
      this.__matchers__.length = 0;
      return <WhenMockedFn>this;
    };

    const matcherObjs = this.mockFunctions(matchers, shouldMatch);
    // @ts-ignore
    if (!this.fn.__matchers__) this.fn.__matchers__ = [];
    // @ts-ignore
    this.fn.__matchers__ = this.fn.__matchers__.concat(matcherObjs);

    mocks.add(<WhenMockedFn>this.fn);
    return this.fn;
  }

  // mockImpl is the function that returns a value if args matches the matchers
  // Change the mock implementation method to only run mockImpl if the two values match
  // Return the mocked function so it can be changed, like normal jest mock functions
  private mockReturnFn(matcher: Matcher, shouldMatch: boolean, mockImpl: Function): WhenMockedFn {
    matcher.mockImpl = mockImpl;
    const fn: WhenMockedFn = <WhenMockedFn>this.fn;
    this.fn.mockImplementation((...args: any) => {
      const matcher = match(fn.__matchers__, args);
      if (matcher !== undefined && shouldMatch) return matcher.mockImpl();
    });
    return <WhenMockedFn>this.fn;
  }

  public calledWith(...matchers: any): WhenMockedFn {
    return <WhenMockedFn>this.mock(matchers, true);
  }

  public notCalledWith(...matchers: any): jest.Mock {
    return <WhenMockedFn>this.mock(matchers, true);
  }
}

// Keep track of when mocks made so they can be destroyed
const mocks: Set<WhenMockedFn> = new Set();

// Return a new jest.Mock with added "when" functionality
function when(fn: jest.Mock): WhenMock {
  return new WhenMock(fn);
}

function resetAllWhenMocks() {
  for (const mock of mocks) mock.resetWhenMock();
  // Empty the set
  mocks.clear();
}

export {
  WhenMockedFn,
  when,
  resetAllWhenMocks
};
