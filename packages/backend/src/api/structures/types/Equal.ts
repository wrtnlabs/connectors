/**
 * 구현 방법
 */
type Expression<X> = <T>() => T extends X ? 1 : 2;

/**
 * @title 두 타입이 동일한 타입인지 확인하기 위한 타입
 */
export type Equal<X, Y> = Expression<X> extends Expression<Y> ? true : false;
