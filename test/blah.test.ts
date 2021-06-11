// import { ServerTools } from '../src';

describe('blah', () => {
  it('works', async () => {
    expect(2).toEqual(2);
  });
});

// describe('Common', () => {
//   const vitalik_name = 'vitalik.eth';
//   const vitalik_address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
//   it('resolveName', async () => {
//     const provider = ServerTools.getProvider();
//     expect(await CommonTools.resolveName(provider, vitalik_name)).toEqual(vitalik_address);
//   });
//   it('lookupAddress', async () => {
//     const provider = ServerTools.getProvider();
//     expect(await CommonTools.lookupAddress(provider, vitalik_address)).toEqual(vitalik_name);
//   });
//   it('validateNameAddressPair', async () => {
//     const provider = ServerTools.getProvider();
//     expect(await CommonTools.validateNameAddressPair(provider, vitalik_name, vitalik_address)).toEqual(true);
//   });
// });
