// server/utils/solana-nft-utils.js
const { 
    Connection, 
    Keypair, 
    PublicKey, 
    Transaction, 
    SystemProgram, 
    sendAndConfirmTransaction 
  } = require('@solana/web3.js');
  const { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo, 
    createSetAuthorityInstruction, 
    AuthorityType 
  } = require('@solana/spl-token');
  const { Metadata, DataV2 } = require('@metaplex-foundation/mpl-token-metadata');
  const bs58 = require('bs58');
  const fs = require('fs');
  const config = require('../config');
  require('dotenv').config();
  
  // Подключение к сети Solana
  const connection = new Connection(config.solana.rpcUrl, 'confirmed');
  
  // Пара ключей для минтинга NFT
  // В реальном приложении ключи должны быть надежно защищены
  // и не храниться в коде или репозитории
  let mintAuthority;
  if (process.env.MINT_AUTHORITY_PRIVATE_KEY) {
    // Если приватный ключ предоставлен в переменных окружения
    const privateKeyBytes = bs58.decode(process.env.MINT_AUTHORITY_PRIVATE_KEY);
    mintAuthority = Keypair.fromSecretKey(privateKeyBytes);
  } else {
    // Для разработки создаем новую пару ключей
    // В продакшене этот вариант использовать нельзя
    mintAuthority = Keypair.generate();
    console.warn('Warning: Using a generated keypair for NFT minting. This should only be used for development.');
  }
  
  // Функция для создания и минтинга NFT
  const mintNFTOnSolana = async (receiverAddress, metadata) => {
    try {
      // В реальном приложении здесь должен быть код для создания NFT на блокчейне Solana
      // Для простоты и отладки возвращаем моковые данные
      // В продакшене замените эту заглушку на реальный код минтинга
      
      // Создаем задержку, чтобы симулировать время, необходимое для минтинга
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Возвращаем моковый результат
      return {
        success: true,
        mintAddress: `mock_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        txHash: `mock_tx_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
      };
      
      // Ниже приведен пример реального кода для минтинга NFT на Solana
      // Этот код закомментирован, так как для его работы требуется
      // настройка ключей и тестирование на реальной сети
      
      /*
      // Проверяем адрес получателя
      const receiverPublicKey = new PublicKey(receiverAddress);
      
      // Создаем новый минт
      const mint = await createMint(
        connection,
        mintAuthority,
        mintAuthority.publicKey,
        mintAuthority.publicKey,
        0 // 0 decimals для NFT
      );
      
      // Получаем или создаем токен-аккаунт для получателя
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        mintAuthority,
        mint,
        receiverPublicKey
      );
      
      // Минтим один токен (NFT) на аккаунт получателя
      await mintTo(
        connection,
        mintAuthority,
        mint,
        tokenAccount.address,
        mintAuthority.publicKey,
        1 // 1 токен для NFT
      );
      
      // Устанавливаем авторитет минта в null, чтобы сделать токен неизменяемым
      const freezeAuthorityTransaction = new Transaction().add(
        createSetAuthorityInstruction(
          mint,
          mintAuthority.publicKey,
          AuthorityType.MintTokens,
          null
        )
      );
      
      await sendAndConfirmTransaction(
        connection,
        freezeAuthorityTransaction,
        [mintAuthority]
      );
      
      // Создаем метаданные для NFT
      const metadataPDA = await Metadata.getPDA(mint);
      const metadataTransaction = new Transaction().add(
        Metadata.createCreateMetadataAccountV2Instruction({
          metadata: metadataPDA,
          mint,
          mintAuthority: mintAuthority.publicKey,
          payer: mintAuthority.publicKey,
          updateAuthority: mintAuthority.publicKey,
          data: new DataV2({
            name: metadata.name,
            symbol: 'NANTI',
            uri: `${config.baseUrl}/api/nft/metadata/${mint.toString()}`,
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: mintAuthority.publicKey,
                verified: true,
                share: 100
              }
            ],
            collection: null,
            uses: null
          })
        })
      );
      
      const txHash = await sendAndConfirmTransaction(
        connection,
        metadataTransaction,
        [mintAuthority]
      );
      
      return {
        success: true,
        mintAddress: mint.toString(),
        txHash
      };
      */
    } catch (error) {
      console.error('Solana NFT minting error:', error);
      throw error;
    }
  };
  
  module.exports = {
    mintNFTOnSolana
  };