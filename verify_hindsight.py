import os
import asyncio
from hindsight_client import Hindsight

async def verify():
    print("Verifying Hindsight Connection...")
    api_url = "https://api.hindsight.vectorize.io"
    api_key = "hsk_c58adba18b5ac509a744563df3c9b6da_06c695992f876411"
    
    try:
        client = Hindsight(base_url=api_url, api_key=api_key)
        print(f"Connected to {api_url}")
        print("Fetching memory banks...")
        
        try:
            # list_banks is async
            response = await client.banks.list_banks()
            print("\n✅ Successfully connected! Found banks:")
            banks = response.banks if hasattr(response, 'banks') else response
            
            count = 0
            for bank in banks:
                count += 1
                name = bank.name if hasattr(bank, 'name') else bank.get('name', 'Unknown')
                bank_id = bank.bank_id if hasattr(bank, 'bank_id') else bank.get('bank_id', 'Unknown')
                print(f"- {bank_id}: {name}")
                
            if count == 0:
                print("No banks found. The connection works, but your account is empty.")
        except Exception as e:
            print(f"Error listing banks: {e}")
            
    except Exception as e:
        print(f"❌ Failed to connect to Hindsight: {e}")

if __name__ == "__main__":
    asyncio.run(verify())
