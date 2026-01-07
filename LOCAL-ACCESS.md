# Local Network Access

Access the AI Parliament on your local network without deploying to the cloud!

## Your Network Information

**Local IP Address:** `21.0.0.164`

## Quick Start

### Option 1: AI-Powered Mode (Recommended)

**Requirements:** Anthropic API key

```bash
# Set your API key
export ANTHROPIC_API_KEY=sk-ant-your-key-here

# Start both servers
./start-local.sh
```

**Access URLs:**
- **This computer:** http://localhost:3000
- **Other devices on your network:** http://21.0.0.164:3000

### Option 2: Demo Mode (No API Key)

Uses simulated responses (free, instant, no API key needed):

```bash
./start-local-demo.sh
```

**Access URLs:**
- **This computer:** http://localhost:3000
- **Other devices on your network:** http://21.0.0.164:3000

## Manual Start

### AI-Powered Mode

**Terminal 1 - Backend:**
```bash
ANTHROPIC_API_KEY=sk-ant-xxx npm run server:ai
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev -- --host
```

### Demo Mode

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev -- --host
```

## Accessing from Other Devices

### From Your Phone or Tablet

1. Make sure the device is on the **same WiFi network**
2. Open a browser
3. Navigate to: **http://21.0.0.164:3000**
4. Start asking the parliament questions!

### From Another Computer

1. Connect to the **same network**
2. Open any browser
3. Go to: **http://21.0.0.164:3000**

## Troubleshooting

### Can't connect from other devices?

**Check firewall:**
```bash
# Allow ports 3000 and 3001
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
```

**Verify servers are running:**
```bash
# Check backend
curl http://localhost:3001/api/health

# Check frontend
curl http://localhost:3000
```

### Wrong IP address?

Your IP might change. Get the current one:
```bash
hostname -I | awk '{print $1}'
```

### API key not working?

Make sure it's set before starting the server:
```bash
echo $ANTHROPIC_API_KEY  # Should show your key
```

## Sharing with Others

To share access with colleagues/friends on your network:

1. Tell them your local IP: **21.0.0.164**
2. They open: **http://21.0.0.164:3000**
3. They can now use the parliament!

**Note:** They must be on the same network as you.

## Performance Tips

- **For demos:** Use 10-20 experts (fast, low cost)
- **For deep analysis:** Use 50-100 experts
- **Maximum:** 500 experts (will take several minutes)

## Stopping the Servers

Press **Ctrl+C** in the terminals where servers are running

Or kill all processes:
```bash
pkill -f "tsx src/server"
pkill -f "vite"
```

## Security Notes

- This is LOCAL network access only
- Not accessible from the internet (safe)
- Only devices on your WiFi can access
- For internet access, use deployment options (see DEPLOYMENT.md)

## Cost Monitoring (AI Mode)

When using AI-powered mode:
- Each expert: ~$0.005-0.01
- 20 experts: ~$0.10-0.20 per query
- Monitor at: https://console.anthropic.com/

Set lower defaults in the web interface to control costs.
